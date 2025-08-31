'use client';

import type React from 'react';
import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import ReactPlayer from 'react-player';
import { RadioStation } from '@/app/types';

const PLAYER_TYPE = process.env.NEXT_PUBLIC_PLAYER || 'CLIENT';

// Server-side playback function remains unchanged.
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
  isLoading: boolean;
  playStation: (station: RadioStation | null) => void;
  stopPlayback: () => void;
  addFavorite: (station: RadioStation) => void;
  deleteFavorite: (station: RadioStation) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<RadioStation[]>([]);
  const [station, setStation] = useState<RadioStation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    // Initialize Player status for server-side playback
    const checkPlaybackStatus = async () => {
      try {
        const response = await fetch('/api/player?type=status');
        const { playback, data } = await response.json();
        if (playback) setStation({ ...data });
      } catch (error) {
        console.error('API request failed:', error);
      }
    };

    if (PLAYER_TYPE === 'SERVER') {
      checkPlaybackStatus();
    }
  }, []);

  const playStation = useCallback(
    async (nextStation: RadioStation | null) => {
      if (!nextStation || nextStation.station_id === station?.station_id) {
        return;
      }

      setIsLoading(true);

      // Inform the backend to register this station click
      fetch('/api/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextStation),
      });

      if (PLAYER_TYPE === 'SERVER') {
        const playbackStatus = await serverPlayback(nextStation);
        if (playbackStatus === 'DONE') {
          setStation(nextStation);
        }
        setIsLoading(false);
      } else {
        // Set the new station. The player will start loading it.
        setStation(nextStation);
      }
    },
    [station],
  );

  const stopPlayback = useCallback(() => {
    if (PLAYER_TYPE === 'SERVER') {
      fetch('/api/player', { method: 'DELETE' });
    }

    // For client playback, updating state is enough.
    setStation(null);
    setIsLoading(false);
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

  // Memoize the context value to prevent unnecessary re-renders of consumers.
  const contextValue = useMemo(
    () => ({
      station,
      favorites,
      isLoading,
      playStation,
      stopPlayback,
      addFavorite,
      deleteFavorite,
    }),
    [station, favorites, isLoading, playStation, stopPlayback, addFavorite, deleteFavorite],
  );

  // Check if the react-player should be rendered
  const renderReactPlayer = PLAYER_TYPE !== 'SERVER' && station;

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
      {renderReactPlayer && (
        <ReactPlayer
          src={`/api/proxy?url=${encodeURIComponent(station.url)}`}
          playing={true}
          height={0}
          width={0}
        />
      )}
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
