'use client';

import React, { useEffect, useState } from 'react';
import { RadioStation } from '@/app/types';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

interface ServerInfoProps {
  station: RadioStation;
}

const ServerInfo: React.FC<ServerInfoProps> = ({ station }) => {
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

  return (
    <span>
      <PlayCircleIcon className="mr-1 inline h-4 w-4" />
      {playlist || 'Hang tight...'}
    </span>
  );
};

export default ServerInfo;
