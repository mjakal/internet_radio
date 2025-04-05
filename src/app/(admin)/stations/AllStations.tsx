'use client';

import React, { useEffect, useState, useCallback, useRef } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { RadioStation } from "@/app/types";
import { Loading, NoData } from "@/components/common/ApiComponents";
import Filter from "./Filter";
import StationList from "@/components/stations/StationList";

const STATIONS_PER_PAGE = 24;

export default function AllStations() {
  const { playStation } = usePlayer();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [apiState, setApiState] = useState<string>('LOADING');

  const queryRef = useRef<string>('alternative');

  const fetchStations = useCallback(async (page: number) => {
    const { current: query } = queryRef;

    try {
      setApiState('LOADING');

      const params = new URLSearchParams({
        limit: `${STATIONS_PER_PAGE}`,
        offset: `${(page - 1) * STATIONS_PER_PAGE}`,
      });

      
      if (query) params.append('query', query);
      // if (selectedTag) params.append('tag', selectedTag);
      // if (selectedCountry) params.append('country', selectedCountry);

      const response = await fetch(`/api/stations?${params}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (page === 1) {
        setStations(data);
      } else {
        setStations(prev => [...prev, ...data]);
      }

      setApiState('DONE');
      setHasMore(data.length === STATIONS_PER_PAGE);
    } catch (err) {
      console.error(err);
      setApiState('ERROR');
    }
  }, []);

  const loadMore = useCallback((prevPage: number) => {
    const nextPage = prevPage + 1;
    
    setCurrentPage(nextPage);

    fetchStations(nextPage);
  }, [fetchStations]);

  const onAddFavorite = useCallback(async (station: RadioStation) => {
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(station),
      });
    } catch(error) {
      console.error('API request failed:', error);
    }
  }, []);

  // Reset and fetch when applied filters change
  useEffect(() => {
    setCurrentPage(1);
    setStations([]);
    fetchStations(1);
  }, [fetchStations]);

  const onFilter = (filter: string) => {
    queryRef.current = filter;
    
    fetchStations(1);
  }

  return (
    <>
      <Filter onChange={onFilter} />

      {apiState === 'LOADING' && <Loading />}

      {apiState === 'ERROR' && <NoData />}

      {apiState === 'DONE' && (
        <>
          {stations.length ? (
            <div className="col-span-12 space-y-6 xl:col-span-12">
              <StationList stations={stations} playStation={playStation} onFavorite={onAddFavorite} />
            </div>
          ) : (
            <NoData />
          )}

          {hasMore && (
            <div className="col-span-12 space-y-6 xl:col-span-12">
              <button
                onClick={() => loadMore(currentPage)}
                className="w-full bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-2 rounded-r-md"
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
