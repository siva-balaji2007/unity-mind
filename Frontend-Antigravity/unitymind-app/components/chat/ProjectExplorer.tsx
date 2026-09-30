'use client';

import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  FileCode2,
  Clapperboard,
  Box,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectFile } from '@/types';

interface ProjectExplorerProps {
  files: ProjectFile[];
  onFileSelect?: (file: ProjectFile) => void;
  selectedFileId?: string;
}

type GroupedFiles = {
  scripts: ProjectFile[];
  scenes: ProjectFile[];
  prefabs: ProjectFile[];
};

const FILE_ICONS = {
  script: { icon: FileCode2, color: '#3b82f6', label: 'Scripts' },
  scene: { icon: Clapperboard, color: '#10b981', label: 'Scenes' },
  prefab: { icon: Box, color: '#f59e0b', label: 'Prefabs' },
};

function FileTreeSection({
  type,
  files,
  onFileSelect,
  selectedFileId,
}: {
  type: 'script' | 'scene' | 'prefab';
  files: ProjectFile[];
  onFileSelect?: (file: ProjectFile) => void;
  selectedFileId?: string;
}) {
  const [open, setOpen] = useState(true);
  const cfg = FILE_ICONS[type];
  const Icon = cfg.icon;

  return (
    <div>
      {/* Section header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-neutral-100 transition-colors group"
      >
        {open
          ? <ChevronDown size={13} className="text-neutral-400 flex-shrink-0" />
          : <ChevronRight size={13} className="text-neutral-400 flex-shrink-0" />}
        <Icon size={13} style={{ color: cfg.color }} className="flex-shrink-0" />
        <span className="text-[12.5px] font-medium text-neutral-600 flex-1 text-left">{cfg.label}</span>
        <span className="text-[11px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
          {files.length}
        </span>
      </button>

      {/* Files */}
      {open && (
        <div className="ml-4 border-l border-neutral-100 pl-2 space-y-0.5 mt-0.5">
          {files.length === 0 ? (
            <p className="text-[12px] text-neutral-400 py-1 px-2">No files</p>
          ) : (
            files.map((file) => (
              <button
                key={file.id}
                onClick={() => onFileSelect?.(file)}
                className={cn(
                  'tree-item w-full text-left',
                  selectedFileId === file.id && 'active'
                )}
                title={file.path}
              >
                <Icon size={12} style={{ color: cfg.color }} className="flex-shrink-0" />
                <span className="truncate">{file.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function ProjectExplorer({ files, onFileSelect, selectedFileId }: ProjectExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grouped: GroupedFiles = {
    scripts: filteredFiles.filter((f) => f.type === 'script'),
    scenes: filteredFiles.filter((f) => f.type === 'scene'),
    prefabs: filteredFiles.filter((f) => f.type === 'prefab'),
  };

  return (
    <div className="flex flex-col h-full bg-neutral-0">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-neutral-100 dark:border-neutral-100">
        <FolderOpen size={14} className="text-neutral-400" />
        <span className="text-[12.5px] font-semibold text-neutral-600 dark:text-neutral-500 uppercase tracking-wider">
          Explorer
        </span>
      </div>

      {/* Search Filter input */}
      <div className="px-2 py-2 border-b border-neutral-100 dark:border-neutral-100">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Filter assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-6 py-1 text-[11px] bg-neutral-50 dark:bg-neutral-50 border border-neutral-200 dark:border-neutral-100 rounded-md outline-none focus:border-brand-400 text-neutral-800 dark:text-neutral-900 transition-colors"
          />
          <span className="absolute left-2.5 text-[9px] text-neutral-400">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-neutral-400 hover:text-neutral-600 text-[10px] select-none cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <FileTreeSection
          type="script"
          files={grouped.scripts}
          onFileSelect={onFileSelect}
          selectedFileId={selectedFileId}
        />
        <FileTreeSection
          type="scene"
          files={grouped.scenes}
          onFileSelect={onFileSelect}
          selectedFileId={selectedFileId}
        />
        <FileTreeSection
          type="prefab"
          files={grouped.prefabs}
          onFileSelect={onFileSelect}
          selectedFileId={selectedFileId}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-100 px-3 py-2">
        <p className="text-[11px] text-neutral-400">
          {files.length} file{files.length !== 1 ? 's' : ''} indexed
        </p>
      </div>
    </div>
  );
}
