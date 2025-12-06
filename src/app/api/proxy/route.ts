// /api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import net from 'net';
import { isValidPublicUrl } from '../../../lib/validate_url';
import { URL } from 'url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Creates a proxy connection to an HTTP stream using raw TCP sockets.
 * This function is specifically designed for non-standard HTTP streams.
 * @param streamUrl The HTTP URL of the radio stream to proxy.
 * @returns A promise that resolves with a NextResponse object for streaming.
 */
async function runHttpProxy(streamUrl: string): Promise<NextResponse> {
  return new Promise((resolve, reject) => {
    const targetUrl = new URL(streamUrl);

    // Ensure this proxy is only used for http streams
    if (targetUrl.protocol !== 'http:') {
      return reject(new Error('This proxy only supports http streams.'));
    }

    const host = targetUrl.hostname;
    const port = parseInt(targetUrl.port || '80', 10);

    let controller: ReadableStreamDefaultController<Uint8Array>;
    let isStreamClosed = false;
    let isResolved = false;

    const body = new ReadableStream<Uint8Array>({
      start(c) {
        controller = c;
      },
      cancel() {
        isStreamClosed = true;
        socket.destroy();
      },
    });

    const socket = net.createConnection({ host, port, family: 4 });

    // Add a timeout to prevent the connection from hanging indefinitely
    socket.setTimeout(10000);
    socket.on('timeout', () => {
      socket.destroy();
      if (!isResolved) {
        reject(new Error('Proxy socket connection attempt timed out'));
      }
    });

    socket.on('connect', () => {
      if (isResolved) return;
      isResolved = true;

      const rawHttpRequest = [
        `GET ${targetUrl.pathname}${targetUrl.search} HTTP/1.1`,
        `Host: ${host}`,
        'User-Agent: Mozilla/5.0',
        'Connection: close',
        '\r\n',
      ].join('\r\n');
      socket.write(rawHttpRequest);

      resolve(
        new NextResponse(body, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'no-cache, no-store',
          },
        }),
      );
    });

    socket.on('data', (chunk: Buffer) => {
      if (!isStreamClosed && controller) {
        controller.enqueue(chunk);
      }
    });

    socket.on('end', () => {
      if (!isStreamClosed && controller) {
        isStreamClosed = true;
        controller.close();
      }
    });

    socket.on('error', (err) => {
      if (!isStreamClosed) {
        isStreamClosed = true;
        if (!isResolved) {
          reject(err);
        }
        if (controller) {
          controller.error(err);
        }
      }
    });
  });
}

/**
 * Creates a proxy connection for standard HTTPS streams using the modern 'fetch' API.
 * This function handles redirects automatically.
 * @param streamUrl The HTTPS URL of the radio stream to proxy.
 * @returns A promise that resolves with a NextResponse object for streaming.
 */
async function runHttpsProxy(streamUrl: string): Promise<NextResponse> {
  const response = await fetch(streamUrl, {
    redirect: 'follow',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
  });

  if (!response.ok || !response.body) {
    throw new Error(`Fetch failed with status: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || 'audio/mpeg';
  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store',
    },
  });
}

/**
 * The main API route handler that chooses the correct proxy based on the URL protocol.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const streamUrl = searchParams.get('url') || '';

  if (!isValidPublicUrl(streamUrl)) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  try {
    const targetUrl = new URL(streamUrl);

    // Check the protocol and call the appropriate proxy function.
    if (targetUrl.protocol === 'https:') {
      console.log(`[PROXY] Using HTTPS fetch proxy for: ${streamUrl}`);
      return await runHttpsProxy(streamUrl);
    } else if (targetUrl.protocol === 'http:') {
      console.log(`[PROXY] Using HTTP socket proxy for: ${streamUrl}`);
      return await runHttpProxy(streamUrl);
    } else {
      return new NextResponse('Unsupported protocol', { status: 400 });
    }
  } catch (error) {
    console.error(`[PROXY] FATAL: Failed to proxy ${streamUrl}.`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
