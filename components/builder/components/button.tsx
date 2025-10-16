'use client';

import { useNode } from '@craftjs/core';

export interface ButtonProps {
  text?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  margin?: number;
  padding?: number;
}

export const Button = ({
  text = 'Button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  fullWidth = false,
  margin = 0,
  padding = 0,
}: ButtonProps) => {
  const {
    connectors: { connect, drag },
    selected,
    hovered,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
    hovered: state.events.hovered,
  }));

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-blue-600 hover:bg-blue-50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      ref={(ref) => connect(drag(ref!))}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-medium transition-all cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${hovered ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
      `}
      style={{
        margin: `${margin}px`,
        padding: padding > 0 ? `${padding}px` : undefined,
      }}
    >
      {text}
    </button>
  );
};

Button.craft = {
  displayName: 'Button',
  props: {
    text: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    fullWidth: false,
    margin: 0,
    padding: 0,
  },
  rules: {
    canDrag: () => true,
    canDrop: () => false,
  },
  related: {
    toolbar: () => import('./settings/button-settings'),
  },
};

