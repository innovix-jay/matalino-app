'use client';

import { useNode } from '@craftjs/core';
import { ReactNode } from 'react';

export interface ContainerProps {
  background?: string;
  padding?: number;
  margin?: number;
  width?: string;
  height?: string;
  flexDirection?: 'row' | 'column';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  gap?: number;
  className?: string;
  children?: ReactNode;
}

export const Container = ({
  background = '#ffffff',
  padding = 20,
  margin = 0,
  width = '100%',
  height = 'auto',
  flexDirection = 'column',
  justifyContent = 'start',
  alignItems = 'start',
  gap = 0,
  className = '',
  children,
}: ContainerProps) => {
  const {
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    hovered: state.events.hovered,
  }));

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      className={`
        ${flexDirection === 'row' ? 'flex-row' : 'flex-col'}
        ${justifyMap[justifyContent]}
        ${alignMap[alignItems]}
        ${className}
        relative flex transition-all
        ${selected ? 'ring-2 ring-blue-500' : ''}
        ${hovered ? 'ring-2 ring-blue-300' : ''}
      `}
      style={{
        background,
        padding: `${padding}px`,
        margin: `${margin}px`,
        width,
        height,
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
};

Container.craft = {
  displayName: 'Container',
  props: {
    background: '#ffffff',
    padding: 20,
    margin: 0,
    width: '100%',
    height: 'auto',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'start',
    gap: 0,
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
  related: {
    toolbar: () => import('./settings/container-settings'),
  },
};

