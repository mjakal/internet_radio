"use client";
import React from "react";
import Image from 'next/image';
import Badge from "../ui/badge/Badge";
import { AudioIcon, GroupIcon } from "@/icons";
import { RadioStation } from "@/app/types";
import { truncateString } from '@/helpers';

interface StationListProps {
  stations: RadioStation[],
  playStation: (station: RadioStation) => void,
  onFavorite: (station: RadioStation) => void,
}

const StationList: React.FC<StationListProps> = ({ stations, playStation, onFavorite }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stations.map((station) => {
        const { id, favicon, name, tags, codec } = station;

        return (
          <div 
            key={id} 
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 hover:shadow-lg transition-shadow" 
          >
            <div className="grid grid-cols-12 gap-1">
              <div className="col-span-4">
                <div className="flex items-center justify-center w-30 h-30 bg-gray-100 rounded-xl dark:bg-gray-800">
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
              </div>

              <div className="col-span-8">
                <div>
                  <h6 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
                    {truncateString(name, 15)}
                  </h6>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {truncateString(tags, 100)}
                  </p>
                  <Badge color="success">
                    <AudioIcon /> {codec || 'MP3'}
                  </Badge>
                </div>
              </div>
              <div className="col-span-6 mt-3">
                <button
                  className="w-full bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-2 rounded-r-md"
                  onClick={() => playStation(station)}
                >
                  Play
                </button>
              </div>
              <div className="col-span-6 mt-3">
                <button
                  className="w-full bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-2 rounded-r-md"
                  onClick={() => onFavorite(station)}
                >
                  Favorite
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StationList;