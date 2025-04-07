'use client';
import React from 'react';
import Image from 'next/image';
import Badge from '../ui/badge/Badge';
import { PlayIcon, HeartIcon } from '@heroicons/react/24/solid';
import { RadioStation } from '@/app/types';
import { truncateString } from '@/helpers';

interface StationListProps {
  stations: RadioStation[];
  playStation: (station: RadioStation) => void;
  onFavorite: (station: RadioStation) => void;
}

const StationList: React.FC<StationListProps> = ({ stations, playStation, onFavorite }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stations.map((station) => {
        const { station_id, favicon, name, tags, codec, bitrate } = station;

        return (
          <div
            key={station_id}
            className="flex transform cursor-pointer flex-col rounded-2xl border-gray-200 bg-white p-4 shadow-md transition duration-500 ease-in hover:scale-105 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between">
              <div className="mr-auto flex items-center">
                <div className="inline-flex h-12 w-12">
                  <Image
                    src={favicon ? favicon : ''}
                    width={100}
                    height={100}
                    alt="aji"
                    className="relative h-12 w-12 rounded-2xl object-cover p-1"
                  />
                  <span className="absolute inline-flex h-12 w-12 rounded-2xl border-2 border-gray-500 opacity-75" />
                  <span />
                </div>
                <div className="ml-3 flex min-w-0 flex-col">
                  <div className="leading-none font-medium text-gray-100">
                    {truncateString(name, 50)}
                  </div>
                  <p className="mt-1 truncate text-sm leading-none text-gray-200">
                    {truncateString(tags, 50)}
                  </p>
                </div>
              </div>
              <div className="ml-3 flex min-w-0 flex-col">
                <span className="mb-1 text-right text-xs text-gray-500">9:02pm</span>
                <div className="flex">
                  <button
                    type="button"
                    className="flex-no-shrink mr-2 text-xs font-medium tracking-wider text-gray-500 transition duration-300 ease-in hover:text-green-600"
                    title="Play Station"
                    onClick={() => playStation(station)}
                  >
                    <PlayIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="flex-no-shrink mr-2 text-xs font-medium tracking-wider text-gray-500 transition duration-300 ease-in hover:text-green-300"
                    title="Add to favorites"
                    onClick={() => onFavorite(station)}
                  >
                    <HeartIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StationList;
