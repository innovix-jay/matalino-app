'use client';

import { useNode, Element } from '@craftjs/core';

export interface HeroProps {
  background?: string;
  height?: string;
  title?: string;
  subtitle?: string;
}

export const Hero = ({
  background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  height = '500px',
  title = 'Welcome to Your App',
  subtitle = 'Build amazing things',
}: HeroProps) => {
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
        flex flex-col items-center justify-center text-white text-center px-6
        transition-all
        ${selected ? 'ring-2 ring-blue-500' : ''}
        ${hovered ? 'ring-2 ring-blue-300' : ''}
      `}
      style={{
        background,
        height,
      }}
    >
      <h1 className="text-5xl font-bold mb-4">{title}</h1>
      <p className="text-xl opacity-90">{subtitle}</p>
    </div>
  );
};

Hero.craft = {
  displayName: 'Hero',
  props: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    height: '500px',
    title: 'Welcome to Your App',
    subtitle: 'Build amazing things',
  },
  rules: {
    canDrag: () => true,
    canDrop: () => false,
  },
};

