import React from 'react';
import Select from 'react-select';

interface OptionType {
  value: string;
  label: string;
}

interface InputSelectProps {
  options: OptionType[];
  onChange: (option: OptionType | null) => void;
  value?: OptionType | null;
  placeholder?: string;
  isDisabled?: boolean;
  error?: boolean;
  success?: boolean;
}

const InputSelect: React.FC<InputSelectProps> = ({
  options,
  onChange,
  value,
  placeholder = 'Select a country...',
  isDisabled = false,
  error = false,
  success = false,
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      isClearable={true}
      isDisabled={isDisabled}
      classNames={{
        control: ({ isFocused }) =>
          [
            'h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none',
            'dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
            error
              ? 'text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500'
              : success
                ? 'text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300 dark:text-success-400 dark:border-success-500'
                : 'bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800',
            isFocused ? 'ring-2 ring-brand-300' : '',
          ].join(' '),

        menu: () =>
          'bg-white dark:bg-gray-800 mt-1 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10',

        option: ({ isFocused, isSelected }) =>
          [
            'px-4 py-2 text-sm cursor-pointer transition-colors',
            isSelected
              ? 'bg-brand-500 text-white dark:bg-brand-600'
              : isFocused
                ? 'bg-brand-100 text-gray-900 dark:bg-brand-700 dark:text-white'
                : 'text-gray-800 dark:text-white',
          ].join(' '),

        singleValue: () => 'text-gray-800 dark:text-white',
        placeholder: () => 'text-gray-400 dark:text-white/40',
        input: () => 'text-gray-800 dark:text-white',
        noOptionsMessage: () => 'text-sm text-gray-500 px-4 py-2',
      }}
      unstyled
    />
  );
};

export default InputSelect;
