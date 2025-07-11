'use client';
import React from 'react';
import ImageWithFallback from '@/components/common/Image';
import { PlayIcon, StarIcon, TrashIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { RadioStation } from '@/app/types';

interface StationListProps {
  stations: RadioStation[];
  favoriteSet?: Set<string>;
  type: string;
  playStation: (station: RadioStation) => void;
  onFavorite: (station: RadioStation) => void;
}

const StationList: React.FC<StationListProps> = ({
  stations,
  favoriteSet,
  type,
  playStation,
  onFavorite,
}) => {
  const addFavorite = type === 'CREATE';

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {stations.map((station) => {
        const { station_id, favicon, name, tags, bitrate } = station;
        const isFavorite = favoriteSet?.has(station_id);
        const isDisabled = addFavorite && isFavorite;

        return (
          <div
            key={station_id}
            className="flex transform cursor-pointer flex-col rounded-2xl border-gray-200 bg-white p-4 shadow-md transition duration-500 ease-in hover:scale-105 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between">
              <div className="mr-auto flex items-center" onClick={() => playStation(station)}>
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
                    {name}
                  </div>
                  <p className="mt-1 w-40 truncate overflow-hidden text-sm leading-none whitespace-nowrap text-gray-400 sm:w-40 md:w-45 lg:w-45 xl:w-36 dark:text-gray-200">
                    {tags}
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
                    className="flex-no-shrink mr-2 text-xs font-medium tracking-wider text-gray-500 transition duration-300 ease-in hover:text-green-600"
                    title="Play Station"
                    onClick={() => playStation(station)}
                  >
                    <PlayIcon className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    className="flex-no-shrink mr-2 text-xs font-medium tracking-wider text-gray-500 transition duration-300 ease-in hover:text-green-300"
                    title={addFavorite ? 'Add to favorites' : 'Remove from favorites'}
                    onClick={() => onFavorite(station)}
                    disabled={isDisabled}
                  >
                    {addFavorite ? (
                      isFavorite ? (
                        <StarIcon className="h-6 w-6 text-yellow-400 dark:text-purple-400" />
                      ) : (
                        <StarIconOutline className="h-6 w-6" />
                      )
                    ) : (
                      <TrashIcon className="h-6 w-6" />
                    )}
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
