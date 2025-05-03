'use client';
import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import Image from 'next/image';
import { SpeakerWaveIcon, AdjustmentsHorizontalIcon, TagIcon } from '@heroicons/react/24/outline';
import { StopIcon } from '@heroicons/react/24/solid';
import { truncateString } from '@/helpers';
import ClientInfo from './ClientInfo';
import ServerInfo from './ServerInfo';

const PLAYER_TYPE = process.env.NEXT_PUBLIC_PLAYER || 'CLIENT';

const StationPlayer = () => {
  const { station, stopPlayback } = usePlayer();

  // Early exit - stop component rendering
  if (!station) return null;

  const { favicon, name, tags, codec, bitrate } = station;

  return (
    <div className="sticky top-26 z-10 mb-6 flex flex-col">
      <div className="absolute inset-x-0 -top-16 -right-8 -bottom-0 -left-8 -z-10 bg-white shadow-lg dark:bg-gray-900"></div>

      {/* Desktop only */}
      <div className="hidden bg-transparent p-4 md:block dark:bg-transparent">
        <div className="flex-none sm:flex">
          <div className="relative mb-3 h-32 w-32 sm:mb-0">
            <Image
              src={favicon ? favicon : '/images/cards/station-fallback.jpg'}
              width={100}
              height={100}
              alt={name}
              className="h-32 w-32 rounded-2xl object-cover"
            />
          </div>
          <div className="flex-auto justify-evenly sm:ml-5">
            <div className="flex items-center justify-between sm:mt-2">
              <div className="flex items-center">
                <div className="flex flex-col">
                  <div className="w-full flex-none text-lg leading-none font-bold text-gray-800 dark:text-gray-200">
                    {truncateString(name, 50)}
                  </div>
                  <div className="my-1 flex-auto text-gray-400 dark:text-gray-200">
                    <span className="mr-3 overflow-hidden whitespace-nowrap">
                      <TagIcon className="mr-1 inline h-4 w-4" />
                      {tags ? truncateString(tags, 50) : 'No info'}
                    </span>
                  </div>
                  <div className="my-1 flex-auto text-gray-400 dark:text-gray-200">
                    <span className="mr-3">
                      {PLAYER_TYPE === 'SERVER' ? <ServerInfo station={station} /> : <ClientInfo />}
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
              {/* can you set the icon to be inline*/}
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
          <div className="mr-auto flex items-center">
            <div className="inline-flex h-12 w-12">
              <Image
                src={favicon ? favicon : '/images/cards/station-fallback.jpg'}
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
                {name}
              </div>
              <p className="mt-1 w-40 truncate overflow-hidden text-sm leading-none whitespace-nowrap text-gray-400 sm:w-40 md:w-45 lg:w-45 xl:w-36 dark:text-gray-200">
                {PLAYER_TYPE === 'SERVER' ? <ServerInfo station={station} /> : <ClientInfo />}
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
