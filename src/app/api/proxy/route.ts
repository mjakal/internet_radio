import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('URL parameter is required', { status: 400 });
  }

  try {
    // Validate the URL before fetching to prevent errors
    new URL(url);

    // Fetch the external audio stream on the server
    const response = await fetch(url, {
      headers: {
        // Some servers require a user-agent to mimic a browser.
        // Ensure this value is a string.
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    // Check if the request to the stream server was successful
    if (!response.ok) {
      return new NextResponse(`Failed to fetch stream: ${response.statusText}`, {
        status: response.status,
      });
    }

    // Get the response body as a ReadableStream
    const stream = response.body;

    // Create a new response, streaming the audio body back to the client
    // and passing through the original content-type headers.
    return new NextResponse(stream, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
        'Cache-Control': 'no-cache', // Prevent caching of the stream
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

// Force dynamic execution for every request to ensure it runs on the server, bypassing static caching.
export const dynamic = 'force-dynamic';
