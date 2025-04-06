'use client';
import React from 'react';
import Image from 'next/image';
import Badge from '../ui/badge/Badge';
import { AudioIcon, GroupIcon } from '@/icons';
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
            className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-lg md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="grid grid-cols-12 gap-1">
              <div className="col-span-4">
                <div className="flex h-30 w-30 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                  {favicon ? (
                    <Image src={favicon} alt={name} width={60} height={60} className="rounded" />
                  ) : (
                    <GroupIcon className="size-6 text-gray-800 dark:text-white/90" />
                  )}
                </div>
              </div>

              <div className="col-span-8">
                <div>
                  <h6 className="text-title-sm font-bold text-gray-800 dark:text-white/90">
                    {truncateString(name, 15)}
                  </h6>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {truncateString(tags, 100)}
                  </p>
                  <Badge color="success">
                    <AudioIcon /> {`${codec || ''} ${bitrate + ' kbps' || ''}`}
                  </Badge>
                </div>
              </div>
              <div className="col-span-6 mt-3">
                <button
                  className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 w-full rounded-r-md px-4 py-2 text-white"
                  onClick={() => playStation(station)}
                >
                  Play
                </button>
              </div>
              <div className="col-span-6 mt-3">
                <button
                  className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 w-full rounded-r-md px-4 py-2 text-white"
                  onClick={() => onFavorite(station)}
                >
                  Favorite
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StationList;
