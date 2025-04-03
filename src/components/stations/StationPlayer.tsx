"use client";
import React, { useEffect, useState, useRef } from "react";
import { Howl } from 'howler';
import Image from 'next/image';
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, GroupIcon } from "@/icons";
import { RadioStation } from "@/app/types";

const PLAYER_TYPE = process.env.NEXT_PLAYER || 'CLIENT';

interface StationPlayerProps {
  station: RadioStation | null,
  onChange: () => void
}

const clientPlayback = (playerRef: RefObject<Howl | null>, station: RadioStation) => {
  try {
    const { current: player } = playerRef;
      
    if (player) player.unload();

    const newPlayer = new Howl({
      src: [station.url],
      html5: true,
      format: ['mp3', 'aac'],
    });

    newPlayer.play();
    playerRef.current = newPlayer;

    return 'DONE';
  } catch(error) {
    console.error('API request failed:', error);

    return 'ERROR';
  }
}

const serverPlayback = async (station: RadioStation) => {
  try {
    await fetch('/api/player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(station),
    });

    return 'DONE';
  } catch(error) {
    console.error('API request failed:', error);

    return 'ERROR';
  }
}

const StationPlayer: React.FC<StationPlayerProps> = ({ station, onChange }) => {
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const playerRef = useRef<Howl | null>(null);

  // Display component if station is playing on the server
  useEffect(() => {
    // Work in progress
    if (PLAYER_TYPE !== 'SERVER') return;
  }, []);
  
  
  useEffect(() => {
    const playStation = async (station: RadioStation) => {
      const playbackStatus = PLAYER_TYPE === 'SERVER' ? await serverPlayback(station) : clientPlayback(playerRef, station);
  
      if (playbackStatus === 'ERROR') return;
      
      setCurrentStation(station);
    }

    if (!station) return;

    playStation(station);
  }, [station]);

  const stopPlayback = () => {
    if (PLAYER_TYPE === 'SERVER') {
      fetch('/api/player', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      const { current: player } = playerRef;

      if (!player) return;
        
      player.unload();
      playerRef.current = null;
    }

    setCurrentStation(null);
    onChange();
  };

  // Early exit - stop component rendering
  if (!currentStation) return null;
  
  const { favicon, name, tags } = currentStation;
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="grid grid-cols-12 gap-1">
          <div className="col-span-4 flex items-center justify-center w-30 h-30 bg-gray-100 rounded-xl dark:bg-gray-800">
            {favicon ? (
              <Image
                src={favicon}
                alt={name}
                width={60}
                height={60}
                className="rounded"
              />
            ) : (
              <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
            )}
          </div>

          <div className="col-span-8">
            <div>
              <h6 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
                {name}
              </h6>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {tags}
              </span>
              <Badge color="success">
              <ArrowUpIcon /> 11.01%
              </Badge>
            </div>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={stopPlayback}
            >
              Stop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationPlayer;