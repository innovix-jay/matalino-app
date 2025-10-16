'use client';

import { useNode, Element } from '@craftjs/core';
import { ReactNode } from 'react';

export interface NavbarProps {
  background?: string;
  height?: number;
  logo?: string;
  children?: ReactNode;
}

export const Navbar = ({
  background = '#ffffff',
  height = 64,
  logo = 'Logo',
  children,
}: NavbarProps) => {
  const {
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    hovered: state.events.hovered,
  }));

  return (
    <nav
      ref={(ref) => connect(drag(ref!))}
      className={`
        flex items-center justify-between px-6
        border-b transition-all
        ${selected ? 'ring-2 ring-blue-500' : ''}
        ${hovered ? 'ring-2 ring-blue-300' : ''}
      `}
      style={{
        background,
        height: `${height}px`,
      }}
    >
      <div className="font-bold text-lg">{logo}</div>
      <div className="flex items-center gap-6">{children}</div>
    </nav>
  );
};

Navbar.craft = {
  displayName: 'Navbar',
  props: {
    background: '#ffffff',
    height: 64,
    logo: 'Logo',
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
  },
};

