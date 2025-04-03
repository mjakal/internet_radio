'use client';

import React, { useEffect, useState, useCallback, RefObject } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { RadioStation } from "@/app/types";
import Filter from "./Filter";
import StationList from "@/components/stations/StationList";

const STATIONS_PER_PAGE = 24;

export default function AllStations() {
  const { playStation } = usePlayer();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchStations = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: STATIONS_PER_PAGE.toString(),
        offset: ((page - 1) * STATIONS_PER_PAGE).toString()
      });

      /*
      if (searchQuery) params.append('query', searchQuery);
      if (selectedTag) params.append('tag', selectedTag);
      if (selectedCountry) params.append('country', selectedCountry);
      */

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

      // setHasMore(data.length === STATIONS_PER_PAGE);
      // setError(null);
    } catch (err) {
      console.error(err);
      // setError(err instanceof Error ? err.message : 'Failed to fetch stations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset and fetch when applied filters change
  useEffect(() => {
    setCurrentPage(1);
    setStations([]);
    fetchStations(1);
  }, [fetchStations]);

  return (
    <>
      <Filter onChange={(filter: string) => console.log('filter', filter) } />

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <StationList stations={stations} playStation={playStation} />
      </div>
    </>
  );
}
