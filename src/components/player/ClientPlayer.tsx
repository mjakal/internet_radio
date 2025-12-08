'use client';

import { useState, useMemo, memo } from 'react';
import ReactPlayer from 'react-player';
import { RadioStation } from '@/app/types';

const getInitialStreamURL = (url: string): string =>
  url.startsWith('https://') ? url : url.replace('http://', 'https://');

const ClientPlayer: React.FC<{ station: RadioStation | null }> = ({ station }) => {
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  // Derive final URL
  const streamUrl = useMemo(() => {
    if (!station?.url) return null;

    return fallbackUrl ?? getInitialStreamURL(station.url);
  }, [station, fallbackUrl]);

  const handleError = () => {
    if (!station?.url) return setFallbackUrl(null);

    // Already using proxy — avoid infinite loop
    if (fallbackUrl?.startsWith('/api/proxy')) return;

    const proxiedUrl = `/api/proxy?url=${encodeURIComponent(station.url)}`;
    setFallbackUrl(proxiedUrl);
  };

  if (!streamUrl) return null;

  return (
    <ReactPlayer
      key={`${streamUrl}-${station?.replayKey}`}
      src={streamUrl}
      playing
      onError={handleError}
      height={0}
      width={0}
    />
  );
};

export default memo(ClientPlayer);
