/* I need to implement vlc server instead of child_process crap
 * Start VLC server: vlc -I http --http-port=9090
 * API docs: https://wiki.videolan.org/VLC_HTTP_requests/
 */

import { NextResponse } from 'next/server';
import { type ChildProcess } from 'child_process';
import { setTimeout } from 'timers/promises';
import { RadioStation } from '@/app/types';
// @ts-expect-error: play-sound has no type definitions
import play from 'play-sound';

// Use VLC headless mode
const player = play({ players: ['cvlc'] });

const CACHED_STATION: {
  station: RadioStation | null;
  process: ChildProcess | null;
} = {
  station: null,
  process: null,
};

function getProcessStatus() {
  const { process } = CACHED_STATION;

  if (!process || !process.pid) return false;

  return true;
}

async function killProcess() {
  CACHED_STATION.process?.kill();

  CACHED_STATION.station = null;
  CACHED_STATION.process = null;

  await setTimeout(100);
}

export function GET() {
  try {
    const isRunning = getProcessStatus();

    if (!isRunning) return NextResponse.json({ playback: false, data: {} });

    const { station } = CACHED_STATION;

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

    console.log('url', stationURL);

    // Kill process before starting playback
    const isRunning = getProcessStatus();

    if (isRunning) await killProcess();

    CACHED_STATION['station'] = { ...data };
    CACHED_STATION['process'] = player.play(stationURL, (error: undefined) => {
      if (error) console.error('Playback Error:', error);
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'API request failed.' }, { status: 500 });
  }
}

export function DELETE() {
  try {
    killProcess();

    return NextResponse.json({ playback: false, data: {} });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ playback: false, data: {} }, { status: 500 });
  }
}
