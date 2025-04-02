import { Metadata } from "next";
import AllStations from "./AllStations";
import React from "react";

export const metadata: Metadata = {
  title: "Radio Player",
  description: "Internet radio player",
};

export default function Stations() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <AllStations />
    </div>
  );
}
