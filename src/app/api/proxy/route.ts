// /api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import net from 'net';
import { URL } from 'url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const streamUrl = searchParams.get('url');

  if (!streamUrl) {
    return new NextResponse('URL parameter is required', { status: 400 });
  }

  try {
    const targetUrl = new URL(streamUrl);
    const host = targetUrl.hostname;
    const port = parseInt(targetUrl.port || '80', 10);

    const proxyResponse = await new Promise<NextResponse>((resolve, reject) => {
      // FIX: Declare controller in a scope accessible to all event handlers
      let controller: ReadableStreamDefaultController<Uint8Array>;

      const socket = net.createConnection({ host, port }, () => {
        const rawHttpRequest = [
          `GET ${targetUrl.pathname}${targetUrl.search} HTTP/1.1`,
          `Host: ${host}`,
          'User-Agent: Mozilla/5.0',
          'Connection: close',
          '\r\n',
        ].join('\r\n');
        socket.write(rawHttpRequest);

        // We can now resolve immediately because the stream body is defined
        resolve(
          new NextResponse(body, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'no-cache, no-store',
            },
          }),
        );
      });

      let isStreamClosed = false;

      // FIX: Use 'const' and initialize the stream immediately.
      // FIX: Use the specific 'Uint8Array' type instead of 'any'.
      const body = new ReadableStream<Uint8Array>({
        start(c) {
          controller = c;

          socket.on('data', (chunk: Buffer) => {
            if (!isStreamClosed) {
              controller.enqueue(chunk);
            }
          });

          socket.on('end', () => {
            if (!isStreamClosed) {
              isStreamClosed = true;
              controller.close();
            }
          });
        },
        cancel() {
          isStreamClosed = true;
          socket.destroy();
        },
      });

      socket.on('error', (err) => {
        if (!isStreamClosed) {
          isStreamClosed = true;
          reject(err);
          controller.error(err);
        }
      });
    });

    return proxyResponse;
  } catch (error) {
    console.error('[PROXY] FATAL: Caught error in top-level try/catch block.', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
