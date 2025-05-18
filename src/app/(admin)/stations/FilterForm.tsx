'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import InputSelect from '@/components/form/input/InputSelect';
import options from './countries.json';
import { FilterQuery } from '@/app/types';

interface FilterFormProps {
  onFilter: (filter: FilterQuery) => void;
  closeModal: () => void;
}

const FilterForm: React.FC<FilterFormProps> = ({ closeModal, onFilter }) => {
  const [query, setQuery] = useState<FilterQuery>({ station: '', tag: '', country: '' });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (value.length > 50) return;

    setQuery((prevState) => ({ ...prevState, [name]: value }));
  };

  const onSubmit = () => {
    const { station, tag, country } = query;

    // Prevent empty from submit
    if (!station && !tag && !country) return;

    closeModal();
    onFilter(query);
  };

  return (
    <div className="">
      <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Advanced Filter</h4>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="col-span-1 sm:col-span-2">
          <Label>Station</Label>
          <Input
            type="text"
            name="station"
            value={query.station}
            max="30"
            onChange={onChange}
            placeholder="Station Name"
          />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <Label>Genre</Label>
          <Input
            type="text"
            name="tag"
            value={query.tag}
            max="30"
            onChange={onChange}
            placeholder="Station Genre"
          />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <Label>Country</Label>
          <InputSelect
            options={options}
            placeholder="Select a Country"
            onChange={(selected) => {
              setQuery((prevState) => {
                if (!selected) return { ...prevState, country: '' };

                const { label } = selected;

                return { ...prevState, country: label };
              });
            }}
          />
        </div>
      </div>

      <div className="mt-6 flex w-full items-center justify-end gap-3">
        <Button size="sm" variant="outline" onClick={closeModal}>
          Close
        </Button>
        <Button size="sm" onClick={onSubmit}>
          Filter Stations
        </Button>
      </div>
    </div>
  );
};

export default FilterForm;
