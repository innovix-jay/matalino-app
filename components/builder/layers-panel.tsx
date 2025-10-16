'use client';

import { useEditor } from '@craftjs/core';
import { Layers, ChevronRight, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function LayersPanel() {
  const { actions, query, selected } = useEditor((state, query) => ({
    selected: query.getEvent('selected').first(),
  }));

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const renderNode = (nodeId: string, depth: number = 0) => {
    const node = query.node(nodeId).get();
    if (!node) return null;

    const hasChildren = node.data.nodes && node.data.nodes.length > 0;
    const isExpanded = expanded[nodeId];
    const isSelected = selected === nodeId;

    return (
      <div key={nodeId}>
        <div
          className={`
            flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer
            hover:bg-gray-100 dark:hover:bg-gray-700
            ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : ''}
          `}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => actions.selectNode(nodeId)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
              }}
              className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          <span className="flex-1 text-sm truncate">
            {node.data.displayName || node.data.name}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              actions.setHidden(nodeId, !node.data.hidden);
            }}
            className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-0.5"
          >
            {node.data.hidden ? (
              <EyeOff className="h-3 w-3 text-gray-400" />
            ) : (
              <Eye className="h-3 w-3 text-gray-400" />
            )}
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.data.nodes.map((childId: string) =>
              renderNode(childId, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
        <Layers className="h-4 w-4" />
        Layers
      </h2>

      <div className="space-y-0.5">
        {query.getSerializedNodes().ROOT && renderNode('ROOT')}
      </div>
    </div>
  );
}

