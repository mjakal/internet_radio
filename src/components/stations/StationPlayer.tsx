'use client';
import React, { useEffect, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import ImageWithFallback from '@/components/common/Image';
import { SpeakerWaveIcon, AdjustmentsHorizontalIcon, TagIcon } from '@heroicons/react/24/outline';
import { StopIcon } from '@heroicons/react/24/solid';
import { truncateString } from '@/helpers';
import StreamInfo from './StreamInfo';
import MarqueeText from '../common/MarqueeText';

const PLAYER_TYPE = process.env.NEXT_PUBLIC_PLAYER || 'CLIENT';

// Define the shape of our state to link info to a specific URL
interface StreamData {
  url: string;
  info: string;
}

const StationPlayer = () => {
  const { station, playStation, stopPlayback } = usePlayer();

  // We store the info AND the url it belongs to
  const [streamData, setStreamData] = useState<StreamData>({ url: '', info: '' });

  useEffect(() => {
    if (!station) return;

    const { url } = station;
    const controller = new AbortController();
    const signal = controller.signal;

    // We use a specific ID to track the timeout so we can clear it
    let timeoutId: NodeJS.Timeout;

    const endpointURL =
      PLAYER_TYPE === 'SERVER'
        ? '/api/player?type=playlist'
        : `/api/info?stream=${encodeURIComponent(url)}`;

    const getStreamInfo = async () => {
      try {
        const response = await fetch(endpointURL, { signal });
        const data = await response.json();
        const nowPlaying = data.nowPlaying;

        if (!nowPlaying || nowPlaying === 'undefined') {
          setStreamData({ url, info: 'No info...' });
          // We do NOT schedule the next timeout here, effectively stopping the loop
          return;
        }

        setStreamData((prev) => {
          if (prev.url === url && prev.info === nowPlaying) return prev;
          return { url, info: nowPlaying };
        });

        // RECURSIVE PATTERN:
        // Only schedule the next fetch AFTER this one finishes.
        // This acts as the interval, but safer.
        timeoutId = setTimeout(getStreamInfo, 5000);
      } catch (error) {
        // Ignore if the request was cancelled
        if (error instanceof Error && error.name === 'AbortError') return;

        console.error('API request failed:', error);
        setStreamData({ url, info: 'No info...' });

        // Retry on error
        timeoutId = setTimeout(getStreamInfo, 5000);
      }
    };

    // THE ONE-LINER YOU WANTED
    getStreamInfo();

    return () => {
      controller.abort();
      clearTimeout(timeoutId); // Clear the timeout on unmount
    };
  }, [station]);

  if (!station) return null;

  // 4. DERIVED STATE:
  // If the data in state belongs to the current station, show it.
  // Otherwise, return empty string (effectively "Loading..." state).
  // This resets the UI instantly without a state update.
  const activeInfo = streamData.url === station.url ? streamData.info : '';

  const { favicon, name, tags, codec, bitrate } = station;

  return (
    <div className="sticky top-16 z-10 flex flex-col bg-white shadow-lg dark:bg-gray-900">
      {/* Desktop only */}
      <div className="hidden bg-transparent p-4 md:block dark:bg-transparent">
        <div className="flex-none sm:flex">
          <div className="relative mb-3 h-32 w-32 sm:mb-0">
            <ImageWithFallback
              src={favicon}
              fallbackSrc="/images/logo.png"
              width={100}
              height={100}
              alt={name}
              className="h-32 w-32 rounded-2xl object-cover"
            />
          </div>
          <div className="flex-auto justify-evenly sm:ml-5">
            <div
              className="flex cursor-pointer items-center justify-between sm:mt-2"
              onClick={() => playStation(station)}
            >
              <div className="flex items-center">
                <div className="flex flex-col">
                  <div className="w-full flex-none text-lg leading-none font-bold text-gray-800 dark:text-gray-200">
                    <MarqueeText text={name} />
                  </div>
                  <div className="my-1 flex-auto text-gray-400 dark:text-gray-200">
                    <span className="mr-3 overflow-hidden whitespace-nowrap">
                      <TagIcon className="mr-1 inline h-4 w-4" />
                      {tags ? truncateString(tags, 50) : 'No info'}
                    </span>
                  </div>
                  <div className="my-1 flex-auto text-gray-400 dark:text-gray-200">
                    <span className="mr-3">
                      {/* Pass the derived activeInfo */}
                      <StreamInfo info={activeInfo} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex text-sm text-gray-400">
              <div className="inline-flex flex-1 items-center">
                <SpeakerWaveIcon className="h-4 w-4" />
                <p className="ms-1">{codec ? codec : 'MP3'}</p>
              </div>
              <div className="inline-flex flex-1 items-center">
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                <p className="ms-1">{bitrate ? bitrate + ' kbps' : '64 kbps'}</p>
              </div>
              <button
                type="button"
                className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 rounded-r-md px-4 py-2 text-white"
                onClick={stopPlayback}
              >
                <StopIcon className="inline-block h-4 w-4" />
                <span className="ms-1">Stop Playback</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile only */}
      <div className="mb-3 block flex transform cursor-pointer flex-col bg-transparent p-4 md:hidden dark:bg-transparent">
        <div className="flex items-center justify-between">
          <div
            className="mr-auto flex cursor-pointer items-center"
            onClick={() => playStation(station)}
          >
            <div className="inline-flex h-12 w-12">
              <ImageWithFallback
                src={favicon}
                fallbackSrc="/images/logo.png"
                width={100}
                height={100}
                alt={name}
                className="relative h-12 w-12 rounded-2xl object-cover p-1"
              />
              <span className="absolute inline-flex h-12 w-12 rounded-2xl border-2 border-gray-500 opacity-75" />
              <span />
            </div>
            <div className="ml-3 flex min-w-0 flex-col">
              <div className="w-40 truncate overflow-hidden leading-none font-medium whitespace-nowrap text-gray-800 sm:w-40 md:w-45 lg:w-45 xl:w-36 dark:text-gray-200">
                <MarqueeText text={name} />
              </div>
              <p className="mt-1 w-40 truncate overflow-hidden text-sm leading-none whitespace-nowrap text-gray-400 sm:w-40 md:w-45 lg:w-45 xl:w-36 dark:text-gray-200">
                {/* Pass the derived activeInfo */}
                <StreamInfo info={activeInfo} />
              </p>
            </div>
          </div>
          <div className="ml-3 flex min-w-0 flex-col">
            <span className="mb-1 text-center text-xs text-gray-400">
              {bitrate ? bitrate + ' kbps' : '64 kbps'}
            </span>
            <div className="flex">
              <button
                type="button"
                className="w-full text-gray-400 transition-shadow hover:shadow-lg"
                title="Stop Playback"
                onClick={stopPlayback}
              >
                <StopIcon className="inline h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationPlayer;
