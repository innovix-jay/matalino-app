'use client';

import { useEditor } from '@craftjs/core';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Eye, 
  Undo2, 
  Redo2, 
  Smartphone, 
  Tablet, 
  Monitor,
  Code,
  Download,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface EditorHeaderProps {
  projectId: string;
  pageId?: string;
  onSave: () => void;
}

export function EditorHeader({ projectId, pageId, onSave }: EditorHeaderProps) {
  const { enabled, actions, canUndo, canRedo } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const viewportWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <header className="h-16 border-b bg-white dark:bg-gray-800 flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/projects/${projectId}`}>
          <Button variant="ghost" size="sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span className="font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                JcalAI
              </span>
            </div>
          </Button>
        </Link>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => actions.history.undo()}
            disabled={!canUndo}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => actions.history.redo()}
            disabled={!canRedo}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Center Section - Viewport Controls */}
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setViewport('desktop')}
          className={`p-2 rounded transition-colors ${
            viewport === 'desktop'
              ? 'bg-white dark:bg-gray-600 shadow'
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Monitor className="h-4 w-4" />
        </button>
        <button
          onClick={() => setViewport('tablet')}
          className={`p-2 rounded transition-colors ${
            viewport === 'tablet'
              ? 'bg-white dark:bg-gray-600 shadow'
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Tablet className="h-4 w-4" />
        </button>
        <button
          onClick={() => setViewport('mobile')}
          className={`p-2 rounded transition-colors ${
            viewport === 'mobile'
              ? 'bg-white dark:bg-gray-600 shadow'
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Smartphone className="h-4 w-4" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Code className="h-4 w-4 mr-2" />
          View Code
        </Button>
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button 
          size="sm" 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </header>
  );
}

