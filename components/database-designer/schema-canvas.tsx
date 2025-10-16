'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Database, 
  Table as TableIcon, 
  Link as LinkIcon,
  Settings,
  Play,
  Code,
  Save
} from 'lucide-react';
import { TableDefinition, Relationship } from '@/types/project';

interface SchemaCanvasProps {
  projectId: string;
  onSave?: (schema: { tables: TableDefinition[]; relationships: Relationship[] }) => void;
}

export function SchemaCanvas({ projectId, onSave }: SchemaCanvasProps) {
  const [tables, setTables] = useState<TableDefinition[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const addTable = () => {
    const newTable: TableDefinition = {
      id: `table_${Date.now()}`,
      name: `new_table_${tables.length + 1}`,
      columns: [
        {
          id: 'id',
          name: 'id',
          type: 'uuid',
          nullable: false,
          is_primary_key: true,
          is_unique: true,
          is_foreign_key: false,
        },
        {
          id: 'created_at',
          name: 'created_at',
          type: 'timestamp',
          nullable: false,
          is_primary_key: false,
          is_unique: false,
          is_foreign_key: false,
        },
      ],
      indexes: [],
      position: {
        x: 100 + tables.length * 50,
        y: 100 + tables.length * 50,
      },
    };

    setTables([...tables, newTable]);
  };

  const addColumn = (tableId: string) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          columns: [
            ...table.columns,
            {
              id: `col_${Date.now()}`,
              name: `column_${table.columns.length + 1}`,
              type: 'text',
              nullable: true,
              is_primary_key: false,
              is_unique: false,
              is_foreign_key: false,
            },
          ],
        };
      }
      return table;
    }));
  };

  const addRelationship = (fromTable: string, toTable: string) => {
    const newRelationship: Relationship = {
      id: `rel_${Date.now()}`,
      from_table: fromTable,
      from_column: 'id',
      to_table: toTable,
      to_column: 'id',
      relationship_type: 'one-to-many',
    };

    setRelationships([...relationships, newRelationship]);
  };

  const generateSQL = () => {
    let sql = '-- Generated Schema\n\n';

    tables.forEach(table => {
      sql += `CREATE TABLE ${table.name} (\n`;
      
      const columnDefs = table.columns.map(col => {
        let def = `  ${col.name} ${col.type.toUpperCase()}`;
        if (col.is_primary_key) def += ' PRIMARY KEY';
        if (!col.nullable) def += ' NOT NULL';
        if (col.is_unique && !col.is_primary_key) def += ' UNIQUE';
        if (col.default_value) def += ` DEFAULT ${col.default_value}`;
        return def;
      });

      sql += columnDefs.join(',\n');
      sql += '\n);\n\n';
    });

    // Add foreign key constraints
    relationships.forEach(rel => {
      sql += `ALTER TABLE ${rel.from_table}\n`;
      sql += `  ADD CONSTRAINT fk_${rel.from_table}_${rel.to_table}\n`;
      sql += `  FOREIGN KEY (${rel.from_column})\n`;
      sql += `  REFERENCES ${rel.to_table}(${rel.to_column});\n\n`;
    });

    return sql;
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ tables, relationships });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="h-16 border-b bg-white dark:bg-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Database className="h-6 w-6 text-violet-600" />
          <div>
            <h1 className="font-bold text-lg">Database Designer</h1>
            <p className="text-xs text-gray-500">Visual schema builder</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => {
            const sql = generateSQL();
            navigator.clipboard.writeText(sql);
          }}>
            <Code className="h-4 w-4 mr-2" />
            Copy SQL
          </Button>
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4 mr-2" />
            Apply Migration
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            className="bg-gradient-to-r from-violet-600 to-cyan-600"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Schema
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-64 border-r bg-white dark:bg-gray-800 p-4">
          <h2 className="font-semibold mb-4">Tools</h2>
          
          <div className="space-y-2">
            <Button 
              onClick={addTable}
              variant="outline" 
              className="w-full justify-start"
            >
              <TableIcon className="h-4 w-4 mr-2" />
              Add Table
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              disabled={!selectedTable}
              onClick={() => selectedTable && addColumn(selectedTable)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Add Relationship
            </Button>
          </div>

          {/* Table List */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Tables ({tables.length})</h3>
            <div className="space-y-1">
              {tables.map(table => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table.id)}
                  className={`
                    w-full text-left p-2 rounded text-sm
                    ${selectedTable === table.id 
                      ? 'bg-violet-100 dark:bg-violet-900/20 text-violet-600' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <TableIcon className="h-3 w-3 inline mr-2" />
                  {table.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {table.columns.length}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 p-8 relative">
          {tables.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No tables yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  Click "Add Table" to start designing your database
                </p>
                <Button onClick={addTable}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Table
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {tables.map(table => (
                <Card 
                  key={table.id}
                  className={`
                    w-96 cursor-pointer transition-all
                    ${selectedTable === table.id ? 'ring-2 ring-violet-500' : ''}
                  `}
                  onClick={() => setSelectedTable(table.id)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        <TableIcon className="h-4 w-4" />
                        {table.name}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {table.columns.map(column => (
                        <div 
                          key={column.id}
                          className="flex items-center justify-between text-sm p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center gap-2">
                            {column.is_primary_key && (
                              <Badge variant="default" className="text-xs px-1">PK</Badge>
                            )}
                            {column.is_foreign_key && (
                              <Badge variant="secondary" className="text-xs px-1">FK</Badge>
                            )}
                            <span className="font-mono">{column.name}</span>
                          </div>
                          <span className="text-xs text-gray-500 font-mono">
                            {column.type}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        addColumn(table.id);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Column
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 border-l bg-white dark:bg-gray-800 p-4">
          <h2 className="font-semibold mb-4">Properties</h2>
          
          {selectedTable ? (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Table: {tables.find(t => t.id === selectedTable)?.name}
              </p>
              {/* Add table/column properties editor here */}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Select a table to edit its properties
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

