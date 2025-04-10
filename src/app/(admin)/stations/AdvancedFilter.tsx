'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

interface AdvancedFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

type QueryState = {
  station: string;
  tag: string;
  country: string;
};

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ isOpen, closeModal }) => {
  // add type to useState all keys are strings
  const [query, setQuery] = useState<QueryState>({ station: '', tag: '', country: '' });

  const onChange = (event) => {
    const { name, value } = event.target;

    setQuery((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving changes...');
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
      <form className="">
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Advanced Filter
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1 sm:col-span-2">
            <Label>Station</Label>
            <Input
              type="text"
              name="station"
              value={query.station}
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
              onChange={onChange}
              placeholder="Station Genre"
            />
          </div>

          <div className="col-span-1 sm:col-span-2">
            <Label>Country</Label>
            <Input
              type="text"
              name="country"
              value={query.country}
              onChange={onChange}
              placeholder="Station Country"
            />
          </div>
        </div>

        <div className="mt-6 flex w-full items-center justify-end gap-3">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Close
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdvancedFilter;
