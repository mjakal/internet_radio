'use client';
import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import Image from 'next/image';
import {
  SpeakerWaveIcon,
  AdjustmentsHorizontalIcon,
  StopIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
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
    <div className="sticky top-25 z-10 mb-6 flex flex-col">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03]">
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
    </div>
  );
};

export default StationPlayer;
