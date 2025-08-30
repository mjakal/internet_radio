'use client';

import type React from 'react';
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
  RefObject,
} from 'react';
import shaka from 'shaka-player';
import { RadioStation } from '@/app/types';

const PLAYER_TYPE = process.env.NEXT_PUBLIC_PLAYER || 'CLIENT';

// Wrap Shaka initialization for client playback
const clientPlayback = async (
  station: RadioStation,
  audioRef: RefObject<HTMLAudioElement>,
  playerRef: RefObject<shaka.Player | null>,
) => {
  try {
    const { current: audioEl } = audioRef;
    if (!audioEl) return 'ERROR';

    // Clean up old player
    if (playerRef.current) {
      await playerRef.current.destroy();
      playerRef.current = null;
    }

    // Install Shaka polyfills
    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      console.error('Browser not supported by Shaka');
      return 'ERROR';
    }

    // Init player
    const player = new shaka.Player(audioEl);
    playerRef.current = player;

    player.addEventListener('error', (event: shaka.util.ErrorEvent) => {
      console.error('Shaka Player Error:', event.detail);
    });

    // Load the stream (HLS or DASH)
    await player.load(station.url);
    audioEl.play();

    return 'DONE';
  } catch (error) {
    console.error('Playback failed:', error);
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
  favorites: RadioStation[];
  playStation: (station: RadioStation | null) => void;
  stopPlayback: () => void;
  addFavorite: (station: RadioStation) => void;
  deleteFavorite: (station: RadioStation) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<RadioStation[]>([]);
  const [station, setStation] = useState<RadioStation | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<shaka.Player | null>(null);

  useEffect(() => {
    // Initialize Favorites
    const getFavoritesDB = async () => {
      try {
        const response = await fetch('/api/favorites');
        const { data } = await response.json();
        setFavorites(data);
      } catch (err) {
        console.error(err);
      }
    };

    const getFavoritesLocalStorage = () => {
      const storedFavorites = localStorage.getItem('favorites');
      const favorites: RadioStation[] = storedFavorites ? JSON.parse(storedFavorites) : [];
      setFavorites(favorites);
    };

    if (PLAYER_TYPE === 'STANDALONE') {
      getFavoritesLocalStorage();
    } else {
      getFavoritesDB();
    }
  }, []);

  useEffect(() => {
    // Initialize Player
    const checkPlaybackStatus = async () => {
      try {
        const response = await fetch('/api/player?type=status');
        const { playback, data } = await response.json();
        if (playback) setStation({ ...data });
      } catch (error) {
        console.error('API request failed:', error);
      }
    };

    if (PLAYER_TYPE === 'SERVER') checkPlaybackStatus();
  }, []);

  const playStation = useCallback(
    async (nextStation: RadioStation | null) => {
      if (!nextStation) return;
      if (nextStation.station_id === station?.station_id) return;

      fetch('/api/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextStation),
      });

      const playbackStatus =
        PLAYER_TYPE === 'SERVER'
          ? await serverPlayback(nextStation)
          : await clientPlayback(nextStation, audioRef, playerRef);

      if (playbackStatus === 'ERROR') return;

      setStation(nextStation);
    },
    [station],
  );

  const stopPlayback = useCallback(() => {
    if (PLAYER_TYPE === 'SERVER') {
      fetch('/api/player', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      playerRef.current?.destroy();
      playerRef.current = null;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    }

    setStation(null);
  }, []);

  const addFavorite = useCallback(async (station: RadioStation) => {
    try {
      const isStandalone = PLAYER_TYPE === 'STANDALONE';

      if (!isStandalone) {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(station),
        });
      }

      setFavorites((prevState) => {
        const nextState = [...prevState, { ...station }];
        if (isStandalone) localStorage.setItem('favorites', JSON.stringify(nextState));
        return nextState;
      });
    } catch (error) {
      console.error('API request failed:', error);
    }
  }, []);

  const deleteFavorite = useCallback(async (station: RadioStation) => {
    try {
      const isStandalone = PLAYER_TYPE === 'STANDALONE';

      if (!isStandalone) {
        await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(station),
        });
      }

      setFavorites((prevState) => {
        const { station_id } = station;
        const nextState = prevState.filter((item) => item.station_id !== station_id);
        if (isStandalone) localStorage.setItem('favorites', JSON.stringify(nextState));
        return nextState;
      });
    } catch (error) {
      console.error('API request failed:', error);
    }
  }, []);

  return (
    <PlayerContext.Provider
      value={{ station, favorites, playStation, stopPlayback, addFavorite, deleteFavorite }}
    >
      {children}
      {/* Hidden audio element controlled by Shaka */}
      <audio ref={audioRef} controls={false} />
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
