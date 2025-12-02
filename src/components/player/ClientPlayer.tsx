'use client';

import { useState, useEffect, memo } from 'react';
import ReactPlayer from 'react-player';
import { RadioStation } from '@/app/types';

/**
 * Determines the initial URL to try.
 * It upgrades http to https, or leaves https as is.
 */
const getInitialStreamURL = (url: string): string => {
  // If the URL is already https, use it directly.
  if (url.startsWith('https://')) return url;

  // Otherwise, attempt to upgrade it from http to https.
  return url.replace('http://', 'https://');
};

const ClientPlayer: React.FC<{ station: RadioStation | null }> = ({ station }) => {
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // This effect runs whenever a new station is selected.
  // It resets the player's URL to the initial HTTPS attempt.
  useEffect(() => {
    if (station?.url) {
      const initialUrl = getInitialStreamURL(station.url);
      setStreamUrl(initialUrl);

      // Increment version to remount player
      setRefreshKey((prev) => prev + 1);
    } else {
      // Reset to default values
      setStreamUrl('');
      setRefreshKey(0);
    }
  }, [station]);

  // This function is called by ReactPlayer ONLY if the initial URL fails.
  const handleError = () => {
    console.warn(`HTTPS stream failed for ${station?.url}. Falling back to proxy.`);

    // Early exit - no station url
    if (!station?.url) return setStreamUrl('');

    // Guard clause: If we're already using the proxy, don't do anything,
    // to prevent an infinite error loop if the proxy itself fails.
    if (streamUrl.startsWith('/api/proxy')) return;

    // The HTTPS attempt failed, so now we switch to the proxied HTTP URL.
    const proxiedUrl = `/api/proxy?url=${encodeURIComponent(station.url)}`;
    setStreamUrl(proxiedUrl);

    // Increment version to force remount
    setRefreshKey((prev) => prev + 1);
  };

  // Check if the component should render
  if (!station?.url) return null;

  // We must have a streamUrl to render the player
  if (!streamUrl) return null;

  return (
    <ReactPlayer
      key={`${streamUrl}-${refreshKey}`} // The key ensures the player reloads with the new URL
      src={streamUrl}
      playing={true}
      onError={handleError} // This is the crucial part
      height={0}
      width={0}
    />
  );
};

export default memo(ClientPlayer);
