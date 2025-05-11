'use client';

import React from 'react';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import MarqueeText from '../common/MarqueeText';

interface StreamInfoProps {
  info: string;
}

const StreamInfo: React.FC<StreamInfoProps> = ({ info }) => {
  return (
    <span className="flex items-center">
      <PlayCircleIcon className="mr-1 inline h-4 w-4" />
      <MarqueeText text={info || 'Hang tight...'} />
    </span>
  );
};

export default StreamInfo;
