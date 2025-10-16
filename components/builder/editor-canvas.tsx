'use client';

import { Editor, Frame, Element } from '@craftjs/core';
import { useRef } from 'react';

// Import builder components
import { Container } from './components/container';
import { Text } from './components/text';
import { Button } from './components/button';
import { Image } from './components/image';
import { Input } from './components/input';
import { Card } from './components/card';
import { Grid } from './components/grid';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { Hero } from './components/hero';
import { Form } from './components/form';

// Toolbox and settings panels
import { Toolbox } from './toolbox';
import { SettingsPanel } from './settings-panel';
import { LayersPanel } from './layers-panel';
import { EditorHeader } from './editor-header';

interface EditorCanvasProps {
  projectId: string;
  pageId?: string;
  initialState?: Record<string, any>;
  onSave?: (state: Record<string, any>) => void;
}

export function EditorCanvas({ 
  projectId, 
  pageId, 
  initialState,
  onSave 
}: EditorCanvasProps) {
  const editorRef = useRef<any>(null);

  const handleSave = () => {
    if (editorRef.current && onSave) {
      const json = editorRef.current.query.serialize();
      onSave(json);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Editor
        ref={editorRef}
        resolver={{
          Container,
          Text,
          Button,
          Image,
          Input,
          Card,
          Grid,
          Navbar,
          Footer,
          Hero,
          Form,
        }}
        onRender={({ render }) => render}
      >
        {/* Editor Header */}
        <EditorHeader 
          projectId={projectId}
          pageId={pageId}
          onSave={handleSave}
        />

        {/* Main Editor Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Components Toolbox */}
          <div className="w-64 border-r bg-white dark:bg-gray-800 overflow-y-auto">
            <Toolbox />
          </div>

          {/* Center - Canvas */}
          <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl min-h-screen">
                <Frame>
                  <Element
                    canvas
                    is={Container}
                    background="#ffffff"
                    padding={20}
                    className="min-h-screen"
                  >
                    {/* Initial content will be loaded here */}
                  </Element>
                </Frame>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Layers & Settings */}
          <div className="w-80 border-l bg-white dark:bg-gray-800 flex flex-col">
            <div className="flex-1 overflow-y-auto border-b">
              <LayersPanel />
            </div>
            <div className="flex-1 overflow-y-auto">
              <SettingsPanel />
            </div>
          </div>
        </div>
      </Editor>
    </div>
  );
}

