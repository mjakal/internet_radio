'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import StationList from '@/components/stations/StationList';

export default function AllFavorites() {
  const { favorites, playStation, deleteFavorite } = usePlayer();
  const reverseFavorites = [...favorites].reverse();

  return (
    <div className="col-span-12 space-y-6 xl:col-span-12">
      {favorites.length ? (
        <StationList
          stations={reverseFavorites}
          type="DELETE"
          playStation={playStation}
          onFavorite={deleteFavorite}
        />
      ) : (
        <div className="col-span-12 space-y-6 rounded-2xl border border-gray-200 bg-white p-5 xl:col-span-12 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="my-3 flex flex-col justify-center">
            <p className="mb-3 text-gray-500 dark:text-gray-400">
              Welcome to Silicon Radio – your free online radio player with instant access to
              thousands of live radio stations from around the globe. Stream every genre imaginable:
              pop, rock, jazz, electronic, world music, news, sports and talk radio—all without
              registration, fees or downloads. Discover new artists or stay connected to hometown
              favorites in just a few taps.
            </p>
            <p className="mb-3 font-bold text-gray-500 dark:text-gray-400">How to get started:</p>
            <ul className="mb-3 list-inside list-disc text-gray-500 dark:text-gray-400">
              <li>Tap the menu in the top-left</li>
              <li>Select “Stations” to browse by country, genre or language</li>
              <li>Hit the star icon to add stations to your favorites</li>
            </ul>
            <p className="text-gray-500 dark:text-gray-400">
              Once you’ve saved a few, your custom radio lineup will appear here. Enjoy
              uninterrupted, on-demand streaming 24/7 with Silicon Radio!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
