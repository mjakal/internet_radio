'use client';

import ReactPlayer from 'react-player';
import { RadioStation } from '@/app/types';

const PLAYER_TYPE = process.env.NEXT_PUBLIC_PLAYER || 'CLIENT';

const ClientPlayer: React.FC<{ station: RadioStation | null }> = ({ station }) => {
  // Check if the react-player should be rendered
  if (PLAYER_TYPE === 'SERVER') return null;

  // Check if station url exists
  if (!station?.url) return null;

  // Proxy the request before playback
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(station.url)}`;

  return <ReactPlayer src={proxyUrl} playing={true} height={0} width={0} />;
};

export default ClientPlayer;
