import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const encodedUrl = searchParams.get('url');

  if (!encodedUrl) return new NextResponse('URL parameter is required', { status: 400 });

  const decodedUrl = decodeURIComponent(encodedUrl);

  try {
    new URL(decodedUrl);

    const agent = decodedUrl.startsWith('https:')
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined;

    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      redirect: 'follow',
      ...(agent ? { agent } : {}), // only add agent if defined
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch stream: ${response.statusText}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get('content-type') || 'audio/mpeg';

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    if (error instanceof TypeError) return new NextResponse('Invalid URL format', { status: 400 });
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
