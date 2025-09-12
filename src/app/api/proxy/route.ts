// /api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import net from 'net';
import tls from 'tls';
import { URL } from 'url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The legacy socket-based proxy for non-standard streams.
 * It uses raw TCP/TLS sockets to bypass strict HTTP parsing.
 */
function runSocketProxy(streamUrl: string): Promise<NextResponse> {
  return new Promise((resolve, reject) => {
    const targetUrl = new URL(streamUrl);
    const host = targetUrl.hostname;
    const port = parseInt(targetUrl.port || (targetUrl.protocol === 'https:' ? '443' : '80'), 10);

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

    const connectionOptions: tls.ConnectionOptions | net.NetConnectOpts = {
      host,
      port,
      family: 4,
      ...(targetUrl.protocol === 'https:' && {
        rejectUnauthorized: false, // For self-signed certs
      }),
    };

    const socket =
      targetUrl.protocol === 'https:'
        ? tls.connect(connectionOptions as tls.ConnectionOptions)
        : net.createConnection(connectionOptions as net.NetConnectOpts);

    socket.setTimeout(10000); // 10-second connection timeout
    socket.on('timeout', () => {
      socket.destroy();
      if (!isResolved) {
        reject(new Error('Legacy socket connection attempt timed out'));
      }
    });

    const connectHandler = () => {
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
    };

    socket.on('connect', connectHandler);
    socket.on('secureConnect', connectHandler);

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
 * The main proxy handler that attempts to use 'fetch' first and falls back to the socket proxy.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const streamUrl = searchParams.get('url');

  if (!streamUrl) {
    return new NextResponse('URL parameter is required', { status: 400 });
  }

  // --- Main Logic: Try fetch, fallback to socket ---
  try {
    console.log(`[PROXY] Attempting with modern 'fetch' for: ${streamUrl}`);
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

    console.log('[PROXY] Fetch succeeded. Streaming response.');
    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store',
      },
    });
  } catch (error) {
    // Check if the error is a low-level parse error. These often indicate a
    // non-standard stream that the legacy socket proxy can handle.
    const isParseError = error instanceof TypeError;

    if (isParseError) {
      console.warn(
        `[PROXY] Fetch failed with a TypeError (likely a parse error), falling back to legacy socket proxy. Error: ${error.message}`,
      );
      try {
        return await runSocketProxy(streamUrl);
      } catch (socketError) {
        console.error('[PROXY] Legacy socket proxy also failed.', socketError);
        return new NextResponse('Internal Server Error after fallback', { status: 500 });
      }
    } else {
      console.error('[PROXY] Unrecoverable fetch error, not falling back.', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }
}
