'use client';

import { useEditor } from '@craftjs/core';
import { Settings, Sparkles } from 'lucide-react';

export function SettingsPanel() {
  const { selected, actions, query } = useEditor((state, query) => {
    const currentNodeId = query.getEvent('selected').first();
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.toolbar,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return {
      selected,
    };
  });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </h2>
        {selected && (
          <button
            onClick={() => {
              if (selected.isDeletable) {
                actions.delete(selected.id);
              }
            }}
            className="text-xs text-red-600 hover:text-red-700 font-medium"
          >
            Delete
          </button>
        )}
      </div>

      {selected ? (
        <div>
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
              {selected.name}
            </p>
          </div>

          {selected.settings && <selected.settings />}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
            <Sparkles className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a component to edit its properties
          </p>
        </div>
      )}
    </div>
  );
}

