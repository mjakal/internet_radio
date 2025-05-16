// @ts-expect-error: No type declarations for 'icy'
import icy from 'icy';

interface IcyResponse {
  req: { abort(): void };
  on(event: 'metadata', listener: (metadata: Buffer) => void): this;
  once(event: 'metadata', listener: (metadata: Buffer) => void): this;
}

export async function getStreamInfo(streamUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    icy
      .get(streamUrl, (res: IcyResponse) => {
        res.once('metadata', (metadata: Buffer) => {
          const parsed = icy.parse(metadata.toString());
          const title: string = parsed.StreamTitle || 'undefined';
          res.req.abort(); // Stop the stream
          resolve(title);
        });

        const abortRequest = () => {
          res.req.abort();
          // To display or not to display
          // reject(new Error('No metadata received within 500 ms.'));
          reject();
        };

        setTimeout(abortRequest, 1000);
      })
      .on('error', (err: Error) => reject(err));
  });
}
