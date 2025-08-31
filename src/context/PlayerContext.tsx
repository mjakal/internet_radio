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
import { Howl } from 'howler';
import { RadioStation } from '@/app/types';

const PLAYER_TYPE = process.env.NEXT_PUBLIC_PLAYER || 'CLIENT';

const clientPlayback = (station: RadioStation, playerRef: RefObject<Howl | null>) => {
  try {
    const { current: player } = playerRef;

    if (player) player.unload();

    // Create the proxied URL to bypass CORS and other connection issues.
    const proxiedUrl = `/api/proxy?url=${encodeURIComponent(station.url)}`;

    const newPlayer = new Howl({
      src: [proxiedUrl], // Use the proxied URL for playback
      html5: true,
      format: ['mp3', 'aac'], // Give Howler hints about the format
    });

    newPlayer.play();
    playerRef.current = newPlayer;

    return 'DONE';
  } catch (error) {
    console.error('Error during client playback setup:', error);
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
  const playerRef = useRef<Howl | null>(null);

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

    // Early exit - client side playback
    if (PLAYER_TYPE !== 'SERVER') return;

    checkPlaybackStatus();
  }, []);

  const playStation = useCallback(
    async (nextStation: RadioStation | null) => {
      // Early exit - station not defined
      if (!nextStation) return;

      // Early exit - station already playing
      if (nextStation.station_id === station?.station_id) return;

      // Inform the backend to register this station click with the Radio Browser API
      // This helps track popular stations and keeps the public database up-to-date
      fetch('/api/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextStation),
      });

      const playbackStatus =
        PLAYER_TYPE === 'SERVER'
          ? await serverPlayback(nextStation)
          : clientPlayback(nextStation, playerRef);

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
      const { current: player } = playerRef;

      if (!player) return;

      player.unload();

      playerRef.current = null;
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
