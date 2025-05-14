'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { NoData } from '@/components/common/ApiComponents';
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
        <NoData />
      )}
    </div>
  );
}
