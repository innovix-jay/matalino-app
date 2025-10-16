'use client';

import { useNode } from '@craftjs/core';
import { ReactNode } from 'react';

export interface FooterProps {
  background?: string;
  padding?: number;
  children?: ReactNode;
}

export const Footer = ({
  background = '#1f2937',
  padding = 40,
  children,
}: FooterProps) => {
  const {
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    hovered: state.events.hovered,
  }));

  return (
    <footer
      ref={(ref) => connect(drag(ref!))}
      className={`
        transition-all text-white
        ${selected ? 'ring-2 ring-blue-500' : ''}
        ${hovered ? 'ring-2 ring-blue-300' : ''}
      `}
      style={{
        background,
        padding: `${padding}px`,
      }}
    >
      {children}
    </footer>
  );
};

Footer.craft = {
  displayName: 'Footer',
  props: {
    background: '#1f2937',
    padding: 40,
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
  },
};

