import { NextResponse } from 'next/server';
import { exec, type ChildProcess } from 'child_process';
import { RadioStation } from "@/app/types";

const CACHED_STATION: {
  station: RadioStation | null;
  process: ChildProcess | null;
} = {
  station: null,
  process: null,
};

export function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stationURL = searchParams.get('url') || '';
    
    console.log('stream url', stationURL);

    const process = exec(`cvlc ${stationURL}`);

    return NextResponse.json({ msg: 'good'});
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player status' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse JSON body
    const { url: stationURL } = data;

    CACHED_STATION['station'] = { ...data };
    CACHED_STATION['process'] = exec(`cvlc ${stationURL}`);
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      { error: 'API request failed.' },
      { status: 500 }
    );
  }
}