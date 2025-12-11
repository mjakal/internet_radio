'use client';
import React from 'react';
import ComponentCard from '../../common/ComponentCard';
import Label from '../Label';
import Input from '../input/InputField';
import PhoneInput from '../group-input/PhoneInput';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function InputGroup() {
  const countries = [
    { code: 'US', label: '+1' },
    { code: 'GB', label: '+44' },
    { code: 'CA', label: '+1' },
    { code: 'AU', label: '+61' },
  ];

  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log('Updated phone number:', phoneNumber);
  };

  return (
    <ComponentCard title="Input Group">
      <div className="space-y-6">
        <div>
          <Label>Email</Label>
          <div className="relative">
            <Input placeholder="info@gmail.com" type="text" className="pl-[62px]" />
            <span className="absolute top-1/2 left-0 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              {/* 2. Updated Icon Usage */}
              <EnvelopeIcon className="h-5 w-5" />
            </span>
          </div>
        </div>
        <div>
          <Label>Phone</Label>
          <PhoneInput
            selectPosition="start"
            countries={countries}
            placeholder="+1 (555) 000-0000"
            onChange={handlePhoneNumberChange}
          />
        </div>
        <div>
          <Label>Phone</Label>
          <PhoneInput
            selectPosition="end"
            countries={countries}
            placeholder="+1 (555) 000-0000"
            onChange={handlePhoneNumberChange}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
