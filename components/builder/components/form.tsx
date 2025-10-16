'use client';

import { useNode } from '@craftjs/core';
import { ReactNode } from 'react';

export interface FormProps {
  padding?: number;
  margin?: number;
  gap?: number;
  children?: ReactNode;
}

export const Form = ({
  padding = 20,
  margin = 0,
  gap = 16,
  children,
}: FormProps) => {
  const {
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    hovered: state.events.hovered,
  }));

  return (
    <form
      ref={(ref) => connect(drag(ref!))}
      className={`
        flex flex-col transition-all
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${hovered ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
      `}
      style={{
        padding: `${padding}px`,
        margin: `${margin}px`,
        gap: `${gap}px`,
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      {children}
    </form>
  );
};

Form.craft = {
  displayName: 'Form',
  props: {
    padding: 20,
    margin: 0,
    gap: 16,
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
  },
};

