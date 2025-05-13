'use client';

import React, { useState } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import AdvancedFilter from './AdvancedFilter';
import { useModal } from '@/hooks/useModal';
import { FilterQuery } from '@/app/types';

interface FilterProps {
  onFilter: (filter: FilterQuery) => void;
}

const FilterIcon = () => (
  <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
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
);

const Filter: React.FC<FilterProps> = ({ onFilter }) => {
  const [filter, setFilter] = useState<string>('');
  const { isOpen, openModal, closeModal } = useModal();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (!filter) return;

      setFilter('');
      onFilter({ station: filter, tag: '', country: '' });
    }
  };

  const onSubmit = () => {
    setFilter('');
    onFilter({ station: filter, tag: '', country: '' });
  };

  return (
    <div className="col-span-12 md:col-span-6 xl:col-span-4" onSubmit={onSubmit}>
      <div className="relative flex items-center">
        <FilterIcon />
        <input
          type="text"
          value={filter}
          onChange={(event) => {
            const { value } = event.target;

            if (value.length > 50) return;

            setFilter(value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-full rounded-l-md border border-gray-200 bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[430px] dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
        />
        <button
          type="button"
          className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 px-4 py-2 text-white"
          title="Advanced Filter"
          onClick={openModal}
        >
          <AdjustmentsHorizontalIcon className="inline-block h-4 w-4" />
        </button>
        <button
          type="submit"
          className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 rounded-r-md px-4 py-2 text-white"
          title="Filter Stations"
          onClick={onSubmit}
        >
          Filter
        </button>
      </div>
      <AdvancedFilter isOpen={isOpen} closeModal={closeModal} onFilter={onFilter} />
    </div>
  );
};

export default Filter;
