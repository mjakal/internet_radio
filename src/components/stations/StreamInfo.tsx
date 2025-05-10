'use client';

import React, { useEffect, useState } from 'react';
import { RadioStation } from '@/app/types';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import MarqueeText from '../common/MarqueeText';

interface StreamInfoProps {
  station: RadioStation;
}

const StreamInfo: React.FC<StreamInfoProps> = ({ station }) => {
  const [playlist, setPlaylist] = useState<string>('');

  useEffect(() => {
    const getPlaylistInfo = async () => {
      try {
        const { url } = station;
        const encodedUrl = encodeURIComponent(url);

        const response = await fetch(`/api/info?stream=${encodedUrl}`);
        const { nowPlaying } = await response.json();
        const decodedNovPlaying = decodeURIComponent(nowPlaying);

        // No station info - early exit and clear interval
        if (!decodedNovPlaying || decodedNovPlaying === 'undefined') {
          setPlaylist('No info...');

          return clearInterval(interval);
        }

        setPlaylist((prevPlaylist) => {
          // Avoid setting state if the values are equal
          if (prevPlaylist === decodedNovPlaying) return prevPlaylist;

          return decodedNovPlaying;
        });
      } catch (error) {
        console.error('API request failed:', error);
        setPlaylist('No info...');
      }
    };

    const interval = setInterval(getPlaylistInfo, 5000); // every 5 seconds

    setPlaylist('');

    return () => clearInterval(interval);
  }, [station]);

  return (
    <span className="flex items-center">
      <PlayCircleIcon className="mr-1 inline h-4 w-4" />
      <MarqueeText text={playlist || 'Hang tight...'} />
    </span>
  );
};

export default StreamInfo;
