# Silicon Radio

This app is intended for streaming internet radio stations. Its primary objective is to configure an internet radio on a thin client PC or Raspberry Pi, integrate it with your Hi-Fi system, and allow remote control via a smartphone.

At least that’s the goal. I guess we’ll see how it goes :).

## Project requirements

To run this project, ensure that the latest versions of Node.js and npm are installed on your system.

If you intend to use server-side playback, VLC Media Player must also be installed.

**Install node.js and npm**

- node >= 20.19.0
- npm >= 10.8.2
- git >= 2.25.1
- vlc >= 3.0.9.2

## How to run project in development mode

After successfully installing the dependencies, clone the repository from GitHub, then navigate to the internet_radio directory.

Create a .env file and add all the required keys.

```
NEXT_PUBLIC_PLAYER=SERVER # CLIENT || SERVER
NEXT_PUBLIC_PLAYER_PORT=9090 # specify the port for the VLC serve
```

Once you have configured the .env file, run the commands below.

```
npm install
npm run dev
```

If you're using server-side playback, you must start the VLC server in a separate process by running the command below.

```
vlc -I http --http-port=9090
```

That's it! Now you can open your browser and visit...

```
http://localhost:3000
```
