'use client';

import React, { useEffect, useState } from 'react';
import { RadioStation } from '@/app/types';

interface PlaylistInfoProps {
  station: RadioStation;
}

const PlaylistInfo: React.FC<PlaylistInfoProps> = ({ station }) => {
  const [playlist, setPlaylist] = useState<string>('');

  useEffect(() => {
    const getPlaylistInfo = async () => {
      try {
        const response = await fetch('/api/player?type=playlist');
        const { nowPlaying } = await response.json();

        if (!nowPlaying) return clearInterval(interval);

        // do not set state if the values are equal
        setPlaylist((prevPlaylist) => {
          if (prevPlaylist === nowPlaying) return prevPlaylist;

          return nowPlaying;
        });
      } catch (error) {
        console.error('API request failed:', error);
        setPlaylist('');
      }
    };

    const interval = setInterval(getPlaylistInfo, 5000); // every 5 seconds

    setPlaylist('');

    return () => clearInterval(interval);
  }, [station]);

  return <span>{playlist || 'Hang tight...'}</span>;
};

export default PlaylistInfo;
