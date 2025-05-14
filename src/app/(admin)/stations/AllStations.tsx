'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { FilterQuery, RadioStation } from '@/app/types';
import { Loading, NoData } from '@/components/common/ApiComponents';
import Filter from './Filter';
import StationList from '@/components/stations/StationList';

const STATIONS_PER_PAGE = 24;

export default function AllStations() {
  const { favorites, playStation, addFavorite } = usePlayer();
  const [favoriteSet, setFavoriteSet] = useState<Set<string>>(new Set());
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [apiState, setApiState] = useState<string>('LOADING');

  const queryRef = useRef<FilterQuery>({ station: '', tag: '', country: '' });

  const fetchStations = useCallback(async (page: number) => {
    setApiState('LOADING');
    const { station, tag, country } = queryRef.current;

    try {
      const dataOffset = (page - 1) * STATIONS_PER_PAGE;
      const params = new URLSearchParams({
        limit: `${STATIONS_PER_PAGE}`,
        offset: `${dataOffset}`,
      });

      if (station) params.append('query', station);
      if (tag) params.append('tag', tag);
      if (country) params.append('country', country);

      const response = await fetch(`/api/stations?${params}`);
      const stationsData = await response.json();

      // Prevent app crash if stations api fails
      if (stationsData.error) throw new Error(stationsData.error);

      setStations((prevState) => {
        if (page === 1) return [...stationsData];

        // Prevent adding duplicate stations
        const nextState: RadioStation[] = [];
        const stationIDSet: Set<string> = new Set([]);

        prevState.forEach((item) => {
          const { station_id } = item;

          stationIDSet.add(station_id);
          nextState.push(item);
        });

        stationsData.forEach((item: RadioStation) => {
          const { station_id } = item;

          if (stationIDSet.has(station_id)) return;

          nextState.push(item);
        });

        return nextState;
      });

      setHasMore(stationsData.length === STATIONS_PER_PAGE);
      setApiState('DONE');
    } catch (err) {
      console.error(err);
      setApiState('ERROR');
    }
  }, []);

  const loadMore = useCallback(
    (prevPage: number) => {
      const nextPage = prevPage + 1;

      setCurrentPage(nextPage);

      fetchStations(nextPage);
    },
    [fetchStations],
  );

  // Fetch stations on page load
  useEffect(() => {
    setCurrentPage(1);
    setStations([]);
    fetchStations(1);
  }, [fetchStations]);

  // Track favorites changes
  useEffect(() => {
    const nextFavorites = favorites.map(({ station_id }) => station_id);

    setFavoriteSet(new Set(nextFavorites));
  }, [favorites]);

  const onFilter = (filter: FilterQuery) => {
    queryRef.current = { ...filter };
    fetchStations(1);
  };

  return (
    <>
      <Filter onFilter={onFilter} />

      {apiState === 'LOADING' && <Loading />}

      {apiState === 'ERROR' && <NoData />}

      {apiState === 'DONE' && (
        <>
          {stations.length ? (
            <div className="col-span-12 space-y-6 xl:col-span-12">
              <StationList
                stations={stations}
                favoriteSet={favoriteSet}
                type="CREATE"
                playStation={playStation}
                onFavorite={addFavorite}
              />
            </div>
          ) : (
            <NoData />
          )}

          {hasMore && (
            <div className="col-span-12 space-y-6 xl:col-span-12">
              <button
                onClick={() => loadMore(currentPage)}
                className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 w-full rounded-r-md px-4 py-2 text-white"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
