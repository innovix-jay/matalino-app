'use client';

import { useNode } from '@craftjs/core';
import { ReactNode } from 'react';

export interface GridProps {
  columns?: number;
  gap?: number;
  padding?: number;
  margin?: number;
  children?: ReactNode;
}

export const Grid = ({
  columns = 2,
  gap = 16,
  padding = 0,
  margin = 0,
  children,
}: GridProps) => {
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
        grid transition-all
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${hovered ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
      `}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        padding: `${padding}px`,
        margin: `${margin}px`,
      }}
    >
      {children}
    </div>
  );
};

Grid.craft = {
  displayName: 'Grid',
  props: {
    columns: 2,
    gap: 16,
    padding: 0,
    margin: 0,
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
};

