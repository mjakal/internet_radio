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

async function getStatus() {
  const response = await vlcAPIHandler(`status.xml`);

  const playbackStatus = response?.root?.state[0];
  const isPlaying = playbackStatus === 'playing';

  if (!isPlaying) return { playback: false, data: null };

  const { station, fallbackStation } = CACHED_STATION;

  if (!station) return { playback: true, data: { ...fallbackStation } };

  return { playback: true, data: station };
}

async function getPlaylist() {
  const response = await vlcAPIHandler(`playlist.xml`);

  return { playback: true, data: response };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestType = searchParams.get('type') || 'status';

    const response = requestType === 'status' ? await getStatus() : await getPlaylist();

    return NextResponse.json({ ...response });
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

    // await stop payback
    await vlcAPIHandler('status.xml\?command\=pl_stop');
    // await play audio stream
    await vlcAPIHandler(`status.xml\?command\=in_play\&input\=${encodedURL}`);

    CACHED_STATION['station'] = { ...data };

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'API request failed.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // await stop playback
    await vlcAPIHandler(`status.xml\?command\=pl_stop`);
    // await empty playlist
    await vlcAPIHandler('status.xml?command=pl_empty');

    CACHED_STATION['station'] = null;

    return NextResponse.json({ playback: false, data: {} });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ playback: false, data: {} }, { status: 500 });
  }
}
