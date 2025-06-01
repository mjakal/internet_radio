'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import StationList from '@/components/stations/StationList';

export default function AllFavorites() {
  const { favorites, playStation, deleteFavorite } = usePlayer();

  return (
    <div className="col-span-12 space-y-6 xl:col-span-12">
      {favorites.length ? (
        <StationList
          stations={favorites}
          type="DELETE"
          playStation={playStation}
          onFavorite={deleteFavorite}
        />
      ) : (
        <div className="col-span-12 space-y-6 rounded-2xl border border-gray-200 bg-white p-5 xl:col-span-12 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="my-3 flex justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              No favorites yet. Tap the menu in the top-left, head to Stations, and add a few!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
