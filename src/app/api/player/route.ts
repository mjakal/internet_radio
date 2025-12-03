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

// --------------------------
// VLC HTTP API helper
// --------------------------
async function vlcAPIHandler(urlSuffix: string) {
  const response = await fetch(`${VLC_BASE_URL}${urlSuffix}`, {
    method: 'GET',
    headers: { Authorization: `Basic ${VLC_AUTH}` },
  });

  const xml = await response.text();
  return parseStringPromise(xml, JSON_OPTIONS);
}

// --------------------------
// Get playback status
// --------------------------
async function getStatus() {
  const response = await vlcAPIHandler('status.xml');
  const playbackStatus = response?.root?.state?.value;
  const isPlaying = playbackStatus === 'playing';

  if (!isPlaying) return { playback: false, data: null };

  return { playback: true, data: CACHED_STATION.station };
}

// --------------------------
// Get now playing metadata
// --------------------------
async function getPlaylist() {
  const response = await vlcAPIHandler('status.xml');
  const categoryInfo = response?.root?.information?.category[0]?.info;
  const metaInfo = Array.isArray(categoryInfo) ? categoryInfo : [];
  const nowPlaying = metaInfo.find((item) => item.name === 'now_playing')?.value || '';
  return { nowPlaying };
}

// --------------------------
// Watchdog
// --------------------------
function startWatchdog() {
  if (STREAM_WATCHDOG.running) return;

  STREAM_WATCHDOG.running = true;

  const checkPlayback = async () => {
    try {
      const { playback, data } = await getStatus();
      if (playback) return; // already playing
      if (!data?.url) return; // no station

      console.log(`[Watchdog] Playback stopped, retrying ${data.url}…`);
      const encodedURL = encodeURIComponent(data.url);

      await vlcAPIHandler('status.xml?command=pl_stop');
      await vlcAPIHandler('status.xml?command=pl_empty');
      await vlcAPIHandler(`status.xml?command=in_play&input=${encodedURL}`);
    } catch (err) {
      console.error('[Watchdog] Error:', err);
    }
  };

  STREAM_WATCHDOG.interval = setInterval(checkPlayback, 5000);
}

function stopWatchdog() {
  if (!STREAM_WATCHDOG.running) return;

  STREAM_WATCHDOG.running = false;
  if (STREAM_WATCHDOG.interval) clearInterval(STREAM_WATCHDOG.interval);
  STREAM_WATCHDOG.interval = null;
}

// --------------------------
// API Handlers
// --------------------------
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'status';
    const response = type === 'status' ? await getStatus() : await getPlaylist();
    return NextResponse.json(response);
  } catch (err) {
    console.error('[GET] Error:', err);
    return NextResponse.json({ error: 'API request failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data: RadioStation = await request.json();
    const encodedURL = encodeURIComponent(data.url);

    // Stop existing playback
    await vlcAPIHandler('status.xml?command=pl_stop');
    await vlcAPIHandler('status.xml?command=pl_empty');

    // Start new stream
    await vlcAPIHandler(`status.xml?command=in_play&input=${encodedURL}`);
    CACHED_STATION.station = data;

    // Start watchdog
    startWatchdog();

    return NextResponse.json({ data });
  } catch (err) {
    console.error('[POST] Error:', err);
    return NextResponse.json({ error: 'API request failed' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await vlcAPIHandler('status.xml?command=pl_stop');
    await vlcAPIHandler('status.xml?command=pl_empty');

    CACHED_STATION.station = null;

    stopWatchdog();

    return NextResponse.json({ playback: false, data: {} });
  } catch (err) {
    console.error('[DELETE] Error:', err);
    return NextResponse.json({ playback: false, data: {} }, { status: 500 });
  }
}
