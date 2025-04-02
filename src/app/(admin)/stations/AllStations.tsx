'use client';

import { Howl } from 'howler';
import { RadioStation } from "@/app/types";
import StationPlayer from "@/components/stations/StationPlayer";
import StationList from "@/components/stations/StationList";
import React, { useEffect, useState, useCallback } from "react";

const STATIONS_PER_PAGE = 24;

export default function AllStations() {
  const [player, setPlayer] = useState<Howl | null>(null);
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
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
    if (player) player.unload();

    const newPlayer = new Howl({
      src: [station.url],
      html5: true,
      format: ['mp3', 'aac'],
    });

    newPlayer.play();
    setPlayer(newPlayer);
    setCurrentStation(station);
  }

  const stopPlaying = () => {
    if (player) {
      player.unload();
      setPlayer(null);
      setCurrentStation(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <div>
        <form>
          <div className="relative">
            <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
              <svg
                className="fill-gray-500 dark:fill-gray-400"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  fill=""
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search stations..."
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
            />

            <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
              <span> ⌘ </span>
              <span> K </span>
            </button>
          </div>
        </form>
      </div>

      <div className="col-span-12 space-y-6 xl:col-span-12">
        {currentStation && <StationPlayer station={currentStation} stopPlaying={stopPlaying} />}
      </div>

      <div className="col-span-12 space-y-6 xl:col-span-12">
        <StationList stations={stations} playStation={playStation} />
      </div>
    </>
  );
}
