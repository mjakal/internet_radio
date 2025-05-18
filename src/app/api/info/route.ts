import { NextResponse } from 'next/server';
import { getStreamInfo } from '../../../lib/icy';
// here is my backend function that receives url how to decode it
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const encodedUrl = searchParams.get('stream') || '';

    if (!encodedUrl) return NextResponse.json({ nowPlaying: '' });

    const streamUrl = decodeURIComponent(encodedUrl);
    const nowPlaying = await getStreamInfo(streamUrl);

    return NextResponse.json({ nowPlaying });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'API request failed.' }, { status: 500 });
  }
}
