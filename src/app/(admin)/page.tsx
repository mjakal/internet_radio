import type { Metadata } from 'next';
import AllFavorites from './AllFavorites';
import React from 'react';

export const metadata: Metadata = {
  title: 'Radio Player',
  description: 'Internet radio player',
};

export default function Favorites() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <AllFavorites />
    </div>
  );
}
