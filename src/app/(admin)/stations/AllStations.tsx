'use client';

import React, { useEffect, useState, useRef, useCallback, RefObject } from "react";
import { Howl } from 'howler';
import { RadioStation } from "@/app/types";
import Filter from "./Filter";
import StationPlayer from "@/components/stations/StationPlayer";
import StationList from "@/components/stations/StationList";

const PLAYER_TYPE = process.env.NEXT_PLAYER || 'CLIENT';
const STATIONS_PER_PAGE = 24;

const clientPlayback = (playerRef: RefObject<Howl | null>, station: RadioStation) => {
  const { current: player } = playerRef;
    
  if (player) player.unload();

  const newPlayer = new Howl({
    src: [station.url],
    html5: true,
    format: ['mp3', 'aac'],
  });

  newPlayer.play();
  playerRef.current = newPlayer;
}

const serverPlayback = async (station: RadioStation) => {
  try {
    /*
    const { url } = station;
    
    await fetch(`/api/player?url=${url}`);

    */
    const response = await fetch('/api/player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(station),
    });

    const data = await response.json();
    console.log(data);

    return 'DONE';
  } catch(error) {
    console.error('API request failed:', error);

    return 'ERROR';
  }
}

export default function AllStations() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const playerRef = useRef<Howl | null>(null);

  console.log('cp', currentPage);
  console.log('stations', stations);

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

  const playStation = async (station: RadioStation) => {
    // clientPlayback(playerRef, station);
    
    serverPlayback(station);
    
    
    // setCurrentStation(station);
  }

  const stopPlaying = () => {
    const { current: player } = playerRef;

    if (!player) return;
      
    player.unload();
    playerRef.current = null;
    
    setCurrentStation(null);
  };

  return (
    <>
      <Filter onChange={(filter: string) => console.log('filter', filter) } />

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      <div className="col-span-12 space-y-6 xl:col-span-12">
        {currentStation && <StationPlayer station={currentStation} stopPlaying={stopPlaying} />}
      </div>

      <div className="col-span-12 space-y-6 xl:col-span-12">
        <StationList stations={stations} playStation={playStation} />
      </div>
    </>
  );
}
