'use client';
import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import Image from 'next/image';
import Badge from '../ui/badge/Badge';
import { ArrowUpIcon, GroupIcon } from '@/icons';

const StationPlayer = () => {
  const { station, stopPlayback } = usePlayer();

  // Early exit - stop component rendering
  if (!station) return null;

  const { favicon, name, tags } = station;

  return (
    <div className="mb-6 grid grid-cols-1 gap-1">
      <div className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-lg md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="grid grid-cols-12 gap-1">
          <div className="col-span-4 flex h-30 w-30 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
            {favicon ? (
              <Image src={favicon} alt={name} width={60} height={60} className="rounded" />
            ) : (
              <GroupIcon className="size-6 text-gray-800 dark:text-white/90" />
            )}
          </div>

          <div className="col-span-8">
            <div>
              <h6 className="text-title-sm font-bold text-gray-800 dark:text-white/90">{name}</h6>
              <span className="text-sm text-gray-500 dark:text-gray-400">{tags}</span>
              <Badge color="success">
                <ArrowUpIcon /> 11.01%
              </Badge>
            </div>
            <button
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
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
