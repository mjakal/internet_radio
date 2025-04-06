import next from 'next';
import http from 'http';
import { spawn } from 'child_process';

let vlcProcess = null;

export const startVLCServer = () => {
  if (!vlcProcess) {
    vlcProcess = spawn('vlc', ['-I', 'http', '--http-port=9090'], {
      stdio: 'ignore',
      detached: true,
    });

    vlcProcess.unref(); // Allow process to run independently
    console.log('VLC server started on port 9090');
  }
};

export const stopVLCServer = () => {
  if (vlcProcess) {
    vlcProcess.kill();
    vlcProcess = null;
    console.log('VLC server stopped');
  }
};

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  startVLCServer(); // Start VLC server

  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  server.listen(3000, () => {
    console.log('Next.js ready on http://localhost:3000');
  });

  // Cleanup on shutdown
  const shutdown = () => {
    console.log('\nShutting down...');
    stopVLCServer(); // Kill VLC
    server.close(() => {
      process.exit(0);
    });
  };

  // Handle exit signals
  process.on('SIGINT', shutdown); // Ctrl+C
  process.on('SIGTERM', shutdown); // e.g. Docker stop
  process.on('exit', () => {
    stopVLCServer();
  });
});
