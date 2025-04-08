'use client';

import React, { useEffect, useState } from 'react';
import { RadioStation } from '@/app/types';
import { PlayCircleIcon } from '@heroicons/react/24/solid';

const PLAYER_TYPE = process.env.NEXT_PUBLIC_PLAYER || 'CLIENT';

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

    if (PLAYER_TYPE === 'CLIENT') return;

    const interval = setInterval(getPlaylistInfo, 5000); // every 5 seconds

    setPlaylist('');

    return () => clearInterval(interval);
  }, [station]);

  // Early exit: station info not implemented on client playback
  if (PLAYER_TYPE === 'CLIENT') {
    return (
      <span>
        <PlayCircleIcon className="mr-1 inline h-3 w-3" />
        No info
      </span>
    );
  }

  return (
    <span>
      <PlayCircleIcon className="mr-1 inline h-3 w-3" />
      {playlist || 'Hang tight...'}
    </span>
  );
};

export default PlaylistInfo;
