/*
 * Start VLC server with password
 * vlc -I http --http-port=9090 --http-password=mySecretPassword
 * VLC Server API Docs:
 * https://wiki.videolan.org/VLC_HTTP_requests/
 */

import { NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';
import { RadioStation, StreamWatchdog } from '@/app/types';

const JSON_OPTIONS = {
  explicitArray: false, // Always put child nodes in arrays
  explicitCharkey: true, // Use a custom key for text content
  charkey: 'value', // Instead of '_'
  attrkey: 'attrs', // Instead of '$'
  mergeAttrs: true, // Merge attributes directly onto the object
  trim: true, // Remove surrounding whitespace
};
const VLC_BASE_URL = process.env.NEXT_VLC_BASE_URL || '';
const VLC_USERNAME = process.env.NEXT_VLC_USERNAME || '';
const VLC_PASSWORD = process.env.NEXT_VLC_PASSWORD || '';

// Encode credentials to Base64
const VLC_AUTH = Buffer.from(`${VLC_USERNAME}:${VLC_PASSWORD}`).toString('base64');
const CACHED_STATION: {
  station: RadioStation | null;
} = {
  station: null,
};
const STREAM_WATCHDOG: StreamWatchdog = {
  interval: null,
  running: false,
};

async function vlcAPIHandler(urlSuffix: string) {
  const requestURL = `${VLC_BASE_URL}${urlSuffix}`;

  const response = await fetch(requestURL, {
    method: 'GET',
    headers: { Authorization: `Basic ${VLC_AUTH}` },
  });

  const xmlResponse = await response.text(); // Get response as string
  const jsonResponse = await parseStringPromise(xmlResponse, JSON_OPTIONS); // Convert XML to JSON

  return jsonResponse;
}

async function getStatus() {
  const response = await vlcAPIHandler(`status.xml`);

  const playbackStatus = response?.root?.state?.value;
  const isPlaying = playbackStatus === 'playing';

  if (!isPlaying) return { playback: false, data: null };

  const { station } = CACHED_STATION;

  return { playback: true, data: station };
}

async function getPlaylist() {
  const response = await vlcAPIHandler(`status.xml`);

  // Get deep nested now playing info from vlc api
  const categoryInfo = response?.root?.information?.category[0]?.info;
  const metaInfo = Array.isArray(categoryInfo) ? categoryInfo : [];
  const nowPlaying = metaInfo.find(({ name }) => name === 'now_playing')?.['value'] || '';

  return { nowPlaying };
}

// Start watchdog
function startWatchdog() {
  if (STREAM_WATCHDOG.running) return; // already running

  STREAM_WATCHDOG.running = true;

  STREAM_WATCHDOG.interval = setInterval(async () => {
    try {
      const status = await getStatus();
      const { station } = CACHED_STATION;

      if (!status.playback && station?.url) {
        console.log('Watchdog: playback stopped, retrying…');

        const encodedURL = encodeURIComponent(station.url);

        // Retry playback
        await vlcAPIHandler('status.xml\?command\=pl_stop');
        await vlcAPIHandler('status.xml?command=pl_empty');
        await vlcAPIHandler(`status.xml?command=in_play&input=${encodedURL}`);
      }
    } catch (err) {
      console.error('Watchdog error:', err);
    }
  }, 5000); // check every 5 seconds
}

// Stop watchdog
function stopWatchdog() {
  if (!STREAM_WATCHDOG.running) return;

  if (STREAM_WATCHDOG.interval) {
    clearInterval(STREAM_WATCHDOG.interval);
    STREAM_WATCHDOG.interval = null;
  }

  STREAM_WATCHDOG.running = false;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestType = searchParams.get('type') || 'status';

    const response = requestType === 'status' ? await getStatus() : await getPlaylist();

    return NextResponse.json({ ...response });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'API request failed.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse JSON body
    const { url: stationURL } = data;
    const encodedURL = encodeURIComponent(stationURL);

    // await stop payback
    await vlcAPIHandler('status.xml\?command\=pl_stop');
    // await empty playlist
    await vlcAPIHandler('status.xml?command=pl_empty');
    // await play audio stream
    await vlcAPIHandler(`status.xml\?command\=in_play\&input\=${encodedURL}`);

    CACHED_STATION['station'] = { ...data };

    // Start stream watchdog
    startWatchdog();

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

    // Stop stream watchdog
    stopWatchdog();

    return NextResponse.json({ playback: false, data: {} });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ playback: false, data: {} }, { status: 500 });
  }
}
