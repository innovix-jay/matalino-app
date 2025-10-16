'use client';

import { useNode } from '@craftjs/core';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  margin?: number;
}

export const Input = ({
  type = 'text',
  placeholder = 'Enter text...',
  label = '',
  required = false,
  disabled = false,
  fullWidth = true,
  margin = 0,
}: InputProps) => {
  const {
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    hovered: state.events.hovered,
  }));

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      className={`
        ${fullWidth ? 'w-full' : ''}
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2 rounded' : ''}
        ${hovered ? 'ring-2 ring-blue-300 ring-offset-2 rounded' : ''}
      `}
      style={{ margin: `${margin}px` }}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          ${fullWidth ? 'w-full' : ''}
          px-4 py-2 border border-gray-300 dark:border-gray-600
          rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
          dark:bg-gray-800 dark:text-white
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      />
    </div>
  );
};

Input.craft = {
  displayName: 'Input',
  props: {
    type: 'text',
    placeholder: 'Enter text...',
    label: '',
    required: false,
    disabled: false,
    fullWidth: true,
    margin: 0,
  },
  rules: {
    canDrag: () => true,
    canDrop: () => false,
  },
};

