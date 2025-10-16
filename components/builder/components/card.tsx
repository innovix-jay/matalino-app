'use client';

import { useNode } from '@craftjs/core';
import { ReactNode } from 'react';

export interface CardProps {
  padding?: number;
  margin?: number;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: number;
  background?: string;
  children?: ReactNode;
}

export const Card = ({
  padding = 20,
  margin = 0,
  shadow = 'md',
  borderRadius = 8,
  background = '#ffffff',
  children,
}: CardProps) => {
  const {
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    hovered: state.events.hovered,
  }));

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      className={`
        ${shadowClasses[shadow]}
        transition-all
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${hovered ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
      `}
      style={{
        padding: `${padding}px`,
        margin: `${margin}px`,
        borderRadius: `${borderRadius}px`,
        background,
      }}
    >
      {children}
    </div>
  );
};

Card.craft = {
  displayName: 'Card',
  props: {
    padding: 20,
    margin: 0,
    shadow: 'md',
    borderRadius: 8,
    background: '#ffffff',
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
};

