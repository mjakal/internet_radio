'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Loading, NoData } from '@/components/common/ApiComponents';
import { RadioStation } from '@/app/types';
import StationList from '@/components/stations/StationList';

export default function AllFavorites() {
  const { playStation, deleteFavorite } = usePlayer();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [apiState, setApiState] = useState<string>('LOADING');

  const fetchFavorites = useCallback(async () => {
    try {
      setApiState('LOADING');

      const response = await fetch('/api/favorites');
      const { data } = await response.json();

      setStations(data);
      setApiState('DONE');
    } catch (err) {
      console.error(err);
      setApiState('ERROR');
    }
  }, []);

  const onDeleteFavorite = useCallback(
    async (station: RadioStation) => {
      setStations((prevState) => {
        return prevState.filter((item) => item.station_id !== station.station_id);
      });

      deleteFavorite(station);
    },
    [deleteFavorite],
  );

  // Reset and fetch when applied filters change
  useEffect(() => {
    setStations([]);
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <>
      {apiState === 'LOADING' && <Loading />}

      {apiState === 'ERROR' && <NoData />}

      {apiState === 'DONE' && (
        <>
          {stations.length ? (
            <div className="col-span-12 space-y-6 xl:col-span-12">
              <StationList
                stations={stations}
                type="DELETE"
                playStation={playStation}
                onFavorite={onDeleteFavorite}
              />
            </div>
          ) : (
            <NoData />
          )}
        </>
      )}
    </>
  );
}
