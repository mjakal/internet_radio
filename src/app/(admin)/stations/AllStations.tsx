'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { FilterQuery, RadioStation } from '@/app/types';
import { Loading, NoData } from '@/components/common/ApiComponents';
import Filter from './Filter';
import StationList from '@/components/stations/StationList';

const STATIONS_PER_PAGE = 24;

export default function AllStations() {
  const { playStation } = usePlayer();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [apiState, setApiState] = useState<string>('LOADING');

  const queryRef = useRef<FilterQuery>({ station: '', tag: '', country: '' });

  const fetchStations = useCallback(async (page: number) => {
    const { station, tag, country } = queryRef.current;

    try {
      setApiState('LOADING');

      const params = new URLSearchParams({
        limit: `${STATIONS_PER_PAGE}`,
        offset: `${(page - 1) * STATIONS_PER_PAGE}`,
      });

      if (station) params.append('query', station);
      if (tag) params.append('tag', tag);
      if (country) params.append('country', country);

      const response = await fetch(`/api/stations?${params}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (page === 1) {
        setStations(data);
      } else {
        setStations((prev) => [...prev, ...data]);
      }

      setApiState('DONE');
      setHasMore(data.length === STATIONS_PER_PAGE);
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

  const onAddFavorite = useCallback(async (station: RadioStation) => {
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(station),
      });
    } catch (error) {
      console.error('API request failed:', error);
    }
  }, []);

  // Reset and fetch when applied filters change
  useEffect(() => {
    setCurrentPage(1);
    setStations([]);
    fetchStations(1);
  }, [fetchStations]);

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
                type="CREATE"
                playStation={playStation}
                onFavorite={onAddFavorite}
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
