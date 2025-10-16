'use client';

import { useNode } from '@craftjs/core';

export interface ImageProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  borderRadius?: number;
  margin?: number;
}

export const Image = ({
  src = '/placeholder.jpg',
  alt = 'Image',
  width = '100%',
  height = 'auto',
  objectFit = 'cover',
  borderRadius = 0,
  margin = 0,
}: ImageProps) => {
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
        relative transition-all
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${hovered ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
      `}
      style={{ margin: `${margin}px` }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width,
          height,
          objectFit,
          borderRadius: `${borderRadius}px`,
        }}
      />
    </div>
  );
};

Image.craft = {
  displayName: 'Image',
  props: {
    src: '/placeholder.jpg',
    alt: 'Image',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: 0,
    margin: 0,
  },
  rules: {
    canDrag: () => true,
    canDrop: () => false,
  },
};

