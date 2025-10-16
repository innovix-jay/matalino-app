'use client';

import { useNode } from '@craftjs/core';
import { useState } from 'react';

export interface TextProps {
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'semibold' | 'light';
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  margin?: number;
  padding?: number;
  tagName?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
}

export const Text = ({
  text = 'Click to edit text',
  fontSize = 16,
  fontWeight = 'normal',
  color = '#000000',
  textAlign = 'left',
  margin = 0,
  padding = 0,
  tagName = 'p',
}: TextProps) => {
  const {
    connectors: { connect, drag },
    selected,
    hovered,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
    hovered: state.events.hovered,
  }));

  const [editable, setEditable] = useState(false);

  const fontWeightMap = {
    light: '300',
    normal: '400',
    semibold: '600',
    bold: '700',
  };

  const Tag = tagName;

  return (
    <Tag
      ref={(ref) => connect(drag(ref!))}
      contentEditable={editable}
      suppressContentEditableWarning
      onDoubleClick={() => setEditable(true)}
      onBlur={(e) => {
        setEditable(false);
        setProp((props: TextProps) => {
          props.text = e.currentTarget.textContent || '';
        });
      }}
      className={`
        outline-none cursor-pointer transition-all
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${hovered ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
      `}
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: fontWeightMap[fontWeight],
        color,
        textAlign,
        margin: `${margin}px`,
        padding: `${padding}px`,
      }}
    >
      {text}
    </Tag>
  );
};

Text.craft = {
  displayName: 'Text',
  props: {
    text: 'Click to edit text',
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000000',
    textAlign: 'left',
    margin: 0,
    padding: 0,
    tagName: 'p',
  },
  rules: {
    canDrag: () => true,
    canDrop: () => false,
  },
  related: {
    toolbar: () => import('./settings/text-settings'),
  },
};

