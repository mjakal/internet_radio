'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';
import FilterForm from './FilterForm';
import { FilterQuery } from '@/app/types';

interface AdvancedFilterProps {
  isOpen: boolean;
  onFilter: (filter: FilterQuery) => void;
  closeModal: () => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ isOpen, closeModal, onFilter }) => {
  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
      <FilterForm onFilter={onFilter} closeModal={closeModal} />
    </Modal>
  );
};

export default AdvancedFilter;
