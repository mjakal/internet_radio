'use client';

import type React from 'react';
import { createContext, useState, useContext, useEffect, useRef, RefObject } from 'react';
import { Howl } from 'howler';
import { RadioStation } from '@/app/types';

const PLAYER_TYPE = process.env.NEXT_PLAYER || 'SERVER';

const clientPlayback = (playerRef: RefObject<Howl | null>, station: RadioStation) => {
  try {
    const { current: player } = playerRef;

    if (player) player.unload();

    const newPlayer = new Howl({
      src: [station.url],
      html5: true,
      format: ['mp3', 'aac'],
    });

    newPlayer.play();
    playerRef.current = newPlayer;

    return 'DONE';
  } catch (error) {
    console.error('API request failed:', error);

    return 'ERROR';
  }
};

const serverPlayback = async (station: RadioStation | null) => {
  try {
    await fetch('/api/player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(station),
    });

    return 'DONE';
  } catch (error) {
    console.error('API request failed:', error);

    return 'ERROR';
  }
};

type PlayerContextType = {
  station: RadioStation | null;
  playStation: (station: RadioStation | null) => void;
  stopPlayback: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [station, setStation] = useState<RadioStation | null>(null);
  const playerRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Initialize Player
    const checkPlaybackStatus = async () => {
      try {
        const response = await fetch('/api/player');
        const { playback, data } = await response.json();

        if (playback) setStation({ ...data });

        console.log('player status', data);
      } catch (error) {
        console.error('API request failed:', error);
      }
    };

    // Early exit - client side playback
    if (PLAYER_TYPE === 'CLIENT') return;

    checkPlaybackStatus();
  }, []);

  const playStation = async (station: RadioStation | null) => {
    // Early exit - station not defined
    if (!station) return;

    const playbackStatus =
      PLAYER_TYPE === 'SERVER' ? await serverPlayback(station) : clientPlayback(playerRef, station);

    if (playbackStatus === 'ERROR') return;

    setStation(station);
  };

  const stopPlayback = () => {
    if (PLAYER_TYPE === 'SERVER') {
      fetch('/api/player', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      const { current: player } = playerRef;

      if (!player) return;

      player.unload();

      playerRef.current = null;
    }

    setStation(null);
  };

  return (
    <PlayerContext.Provider value={{ station, playStation, stopPlayback }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);

  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }

  return context;
};
