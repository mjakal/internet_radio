"use client";
import React from "react";
import Image from 'next/image';
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, GroupIcon } from "@/icons";
import { RadioStation } from "@/app/types";

interface StationListProps {
  stations: RadioStation[],
}

const StationList: React.FC<StationListProps> = ({ stations }) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {stations.map((station) => {
        const { id, favicon, name, tags } = station;

        return (
          <div key={id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="grid grid-cols-12 gap-1">
              <div className="col-span-4 flex items-center justify-center w-20 h-20 bg-gray-100 rounded-xl dark:bg-gray-800">
                {favicon ? (
                  <Image
                    src={favicon}
                    alt={name}
                    width={48}
                    height={48}
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
              </div>
            </div>
          </div>
        );
      })}
      {/* <!-- Metric Item Start --> */}
      
      {/* <!-- Metric Item End --> */}
    </div>
  );
};

export default StationList;