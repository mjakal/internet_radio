'use client';

import React, { useEffect, useState, useCallback } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { RadioStation } from "@/app/types";
import StationList from "@/components/stations/StationList";

export default function AllFavorites() {
  const { playStation } = usePlayer();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/favorites');
      const { data } = await response.json();

      setStations(data);
    } catch (err) {
      console.error(err);
      // setError(err instanceof Error ? err.message : 'Failed to fetch stations');
    } finally {
      setLoading(false);
    }
  }, []);

  const onDeleteFavorite = useCallback(async (station: RadioStation) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(station),
      });
      const { data } = await response.json();

      setStations(data);
    } catch(error) {
      console.error('API request failed:', error);
    }
  }, []);

  // Reset and fetch when applied filters change
  useEffect(() => {
    setStations([]);
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <>
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <StationList stations={stations} playStation={playStation} onFavorite={onDeleteFavorite} />
      </div>
    </>
  );
}
