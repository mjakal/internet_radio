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
NEXT_VLC_BASE_URL=http://127.0.0.1:9090/requests/
NEXT_VLC_USERNAME= # leave it blank - vlc docs
NEXT_VLC_PASSWORD=mySecretPassword # you should probably change it :)
```

Once you have configured the .env file, run the commands below.

```
npm install
npm run dev
```

If you're using server-side playback, you must start the VLC server in a separate process by running the command below.

```
# NOTE: VLC password must match the one set in the .env file
vlc -I http --http-port=9090 --http-password=mySecretPassword
```

That's it! Now you can open your browser and visit...

```
http://localhost:3000
```

## Start VLC server on system boot Linux

1. Create the service file

Create a new file at:
/etc/systemd/system/vlc-server.service

```
[Unit]
Description=VLC HTTP Server
After=network.target

[Service]
ExecStart=/usr/bin/vlc -I http --http-port=9090 --http-password=mySecretPassword
Restart=always
User=your-username
Environment=DISPLAY=:0

[Install]
WantedBy=multi-user.target
```

2. Replace placeholders

/usr/bin/vlc: Make sure this is the correct path to VLC on your system. Check with which vlc.

your-username: Replace with your Linux username.

3. Enable and start the service

Run these commands:

```
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable vlc-server.service
sudo systemctl start vlc-server.service
# Check status
sudo systemctl status vlc-server.service
# Stop service
sudo systemctl stop vlc-server.service
# Prevent it from starting on system boot
sudo systemctl disable vlc-server.service
```
