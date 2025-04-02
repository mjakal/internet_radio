import type { Metadata } from "next";
import StationList from "@/components/stations/StationList";
import React from "react";

export const metadata: Metadata = {
  title: "Radio Player",
  description: "Internet radio player",
};

export default function Favorites() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <StationList />
      </div>
    </div>
  );
}
