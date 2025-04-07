/*
 * Start VLC server with password
 * vlc -I http --http-port=9090 --http-password=mySecretPassword
 * VLC Server API Docs:
 * https://wiki.videolan.org/VLC_HTTP_requests/
 */

import { NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';
import { RadioStation } from '@/app/types';

const VLC_BASE_URL = process.env.NEXT_VLC_BASE_URL || '';
const VLC_USERNAME = process.env.NEXT_VLC_USERNAME || '';
const VLC_PASSWORD = process.env.NEXT_VLC_PASSWORD || '';

// Encode credentials to Base64
const VLC_AUTH = Buffer.from(`${VLC_USERNAME}:${VLC_PASSWORD}`).toString('base64');
const CACHED_STATION: {
  station: RadioStation | null;
  fallbackStation: RadioStation;
} = {
  station: null,
  fallbackStation: {
    station_id: 'fallback_station',
    name: 'Fallback Station',
    url: '',
    favicon: '',
    tags: 'No info',
    codec: 'MP3',
    bitrate: 64,
  },
};

async function vlcAPIHandler(urlSuffix: string) {
  const requestURL = `${VLC_BASE_URL}${urlSuffix}`;

  const response = await fetch(requestURL, {
    method: 'GET',
    headers: { Authorization: `Basic ${VLC_AUTH}` },
  });

  const xmlResponse = await response.text(); // Get response as string
  const jsonResponse = await parseStringPromise(xmlResponse); // Convert XML to JSON

  return jsonResponse;
}

export async function GET() {
  try {
    const apiURL = `status.xml`;
    const response = await await vlcAPIHandler(apiURL);

    const playbackStatus = response?.root?.state[0];
    const isPlaying = playbackStatus === 'playing';

    if (!isPlaying) return NextResponse.json({ playback: false, data: null });

    const { station, fallbackStation } = CACHED_STATION;

    if (!station) return NextResponse.json({ playback: true, data: { ...fallbackStation } });

    return NextResponse.json({ playback: true, data: station });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ playback: false, data: {} }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse JSON body
    const { url: stationURL } = data;
    const encodedURL = encodeURIComponent(stationURL);
    const apiURL = `status.xml\?command\=in_play\&input\=${encodedURL}`;

    await vlcAPIHandler(apiURL);

    CACHED_STATION['station'] = { ...data };

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'API request failed.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const apiURL = `status.xml\?command\=pl_stop`;

    await vlcAPIHandler(apiURL);

    CACHED_STATION['station'] = null;

    return NextResponse.json({ playback: false, data: {} });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ playback: false, data: {} }, { status: 500 });
  }
}
