import { NextResponse } from 'next/server';
import { isValidPublicUrl } from '../../../lib/validate_url';
import { getStreamInfo } from '../../../lib/icy';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const streamUrl = searchParams.get('stream') || '';

    if (!isValidPublicUrl(streamUrl)) {
      return NextResponse.json({ nowPlaying: '' });
    }

    const nowPlaying = await getStreamInfo(streamUrl);

    return NextResponse.json({ nowPlaying });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'API request failed.' }, { status: 500 });
  }
}
