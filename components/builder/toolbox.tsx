'use client';

import { useEditor, Element } from '@craftjs/core';
import { 
  Box, 
  Type, 
  MousePointer, 
  Image as ImageIcon,
  FormInput,
  CreditCard,
  LayoutGrid,
  Menu,
  Sparkles,
  Layers
} from 'lucide-react';

export function Toolbox() {
  const { connectors } = useEditor();

  const components = [
    {
      category: 'Layout',
      items: [
        {
          name: 'Container',
          icon: Box,
          ref: (ref: any) =>
            connectors.create(
              ref,
              <Element canvas is="Container" background="#ffffff" padding={20} />
            ),
        },
        {
          name: 'Grid',
          icon: LayoutGrid,
          ref: (ref: any) =>
            connectors.create(
              ref,
              <Element canvas is="Grid" columns={2} gap={16} />
            ),
        },
      ],
    },
    {
      category: 'Components',
      items: [
        {
          name: 'Text',
          icon: Type,
          ref: (ref: any) =>
            connectors.create(
              ref,
              <Element is="Text" text="Click to edit text" fontSize={16} />
            ),
        },
        {
          name: 'Button',
          icon: MousePointer,
          ref: (ref: any) =>
            connectors.create(
              ref,
              <Element is="Button" text="Button" variant="primary" />
            ),
        },
        {
          name: 'Image',
          icon: ImageIcon,
          ref: (ref: any) =>
            connectors.create(
              ref,
              <Element is="Image" src="/placeholder.jpg" alt="Image" />
            ),
        },
        {
          name: 'Input',
          icon: FormInput,
          ref: (ref: any) =>
            connectors.create(
              ref,
              <Element is="Input" placeholder="Enter text..." />
            ),
        },
        {
          name: 'Card',
          icon: CreditCard,
          ref: (ref: any) =>
            connectors.create(
              ref,
              <Element canvas is="Card" />
            ),
        },
      ],
    },
    {
      category: 'Sections',
      items: [
        {
          name: 'Navbar',
          icon: Menu,
          ref: (ref: any) =>
            connectors.create(
              ref,
              <Element canvas is="Navbar" />
            ),
        },
        {
          name: 'Hero',
          icon: Sparkles,
          ref: (ref: any) =>
            connectors.create(
              ref,
              <Element canvas is="Hero" />
            ),
        },
        {
          name: 'Footer',
          icon: Layers,
          ref: (ref: any) =>
            connectors.create(
              ref,
              <Element canvas is="Footer" />
            ),
        },
      ],
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
        Components
      </h2>

      {components.map((category) => (
        <div key={category.category} className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            {category.category}
          </h3>
          <div className="space-y-1">
            {category.items.map((item) => (
              <div
                key={item.name}
                ref={item.ref}
                className="
                  flex items-center gap-3 p-3 rounded-lg
                  bg-gray-50 dark:bg-gray-700
                  hover:bg-blue-50 dark:hover:bg-blue-900/20
                  border border-transparent hover:border-blue-200 dark:hover:border-blue-800
                  cursor-move transition-all
                  group
                "
              >
                <item.icon className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

