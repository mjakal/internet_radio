import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

/*
import play from 'play-sound';

const player = play({
  players: ['cvlc'] // Use VLC headless mode
});
let audioProcess: unknown = null; // Store process reference

function isProcessRunning(process: undefined) {
  if (!process || !process.pid) return false;
  
  try {
    process.kill(process.pid, 0); // Signal 0: Doesn't kill, just checks if running
    return true;
  } catch (e) {
    return false;
  }
}
*/

/*
function runProcess(url: string) {
  const audioUrl = decodeURIComponent(url);
  const vlc = spawn('/usr/bin/cvlc', ['-vvv', '--play-and-exit', audioUrl]);

  vlc.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  vlc.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  
  vlc.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}
*/

export function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stationURL = searchParams.get('url') || '';
    
    console.log('url', stationURL);

    /*
    if (!stationURL || typeof stationURL !== 'string') {
      return NextResponse.json(
        { error: 'Invalid url param' },
        { status: 500 },
      )
    }

    if (isProcessRunning(audioProcess)) audioProcess.kill();

    audioProcess = player.play(stationURL, (error: unknown) => {
      if (error) {
        console.error('Error playing audio:', error);
        return NextResponse.json(
          { error: 'Error playing audio.' },
          { status: 500 },
        );
      }
    });
    */
    
    // runProcess(stationURL);

    const scriptPath = path.resolve('./src/scripts/script.sh');

    console.log('path', scriptPath);

    const process = spawn('bash', [scriptPath]);

    let output = '';
    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });

    process.on('close', (code) => {
      console.log(`Script exited with code ${code}`);
    });

    return NextResponse.json({ msg: 'good'});
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player status' },
      { status: 500 }
    );
  }
}