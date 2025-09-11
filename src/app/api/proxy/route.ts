import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Force Node.js runtime
export const dynamic = 'force-dynamic'; // Avoid static caching

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const encodedUrl = searchParams.get('url');

  if (!encodedUrl) return new NextResponse('URL parameter is required', { status: 400 });

  const decodedUrl = decodeURIComponent(encodedUrl);

  try {
    // Validate the URL
    new URL(decodedUrl);

    // Fetch the external audio stream
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch stream: ${response.statusText}`, {
        status: response.status,
      });
    }

    // Forward the original Content-Type header
    const contentType = response.headers.get('content-type') || 'audio/mpeg';

    // Stream the response body back to the client
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    if (error instanceof TypeError) {
      return new NextResponse('Invalid URL format', { status: 400 });
    }

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
