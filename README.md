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

## Deploying the App to a Home Server

When choosing a distribution for your home server, I recommend Debian 12. I encountered some issues getting audio to work properly with Ubuntu Server 24, whereas Debian 12 has proven to be more stable in this regard.

### Validate Audio Output

To verify that audio output is working, run the following command:

```
speaker-test -D hw:0,0 -c 2 -t wav
```

If you don't hear any sound, check the mixer settings using alsamixer. Ensure that all relevant output channels are unmuted (e.g., Master, Headphones, Speaker, PCM, etc.). You can unmute a channel by selecting it and pressing the m key it should display 00 when unmuted.

```
alsamixer
```

After adjusting the settings, try the sound test again.

If the steps above don’t resolve the issue… well, you might be in for a bit of a challenge. 😅

Once you have the sound working, test it using VLC Media Player, as it is one of the requirements for running this application.

```
cvlc /path_to_your_audio_file
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

## Setup NextJS on Debian server

login to server

```
ssh your_user_name@ip_address
```

Install NGINX and Certbot

```
sudo apt install nginx
```

Allow Firewall Access

```
sudo ufw allow "Nginx Full"
ufw allow OpenSSH
ufw enable
```

Install NPM

```
sudo apt install npm
```

install nodejs

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
exec $SHELL
nvm install --lts
```

Install GIT

```
sudo apt install git-all
```

Install pm2

```
npm install -g pm2
```

Check pm2 is working

```
pm2 status
```

Setup SSH key on the server - not required if you clone the repo via https

```
ssh-keygen -t rsa -b 4096 -C "username@email.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub
```

Add public key to github repo settings > deploy key [or add to your profile settings > SSH so you can pull from all repos]

Go to www root

```
cd /var/www
sudo mkdir internet_radio
sudo chown -R yourusername:www-data /var/www/internet_radio
git clone https://github.com/mjakal/internet_radio.git
```

Go inside internet_radio directory

```
cd internet_radio
```

Install npm modules and build the app.

```
npm install
# Before running the build command check if the .env file is configured correctly
npm run build
```

Test the app before deploying

```
npm start
```

Navigate to http://your_server_ip:3000
