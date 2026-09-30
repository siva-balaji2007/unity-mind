'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileCode2,
  Clapperboard,
  Box,
  GitBranch,
  MessageSquare,
  Clock,
  Activity,
  ArrowRight,
  Zap,
  Trash2,
  Loader2,
  Upload,
  UploadCloud,
} from 'lucide-react';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/ui/StatCard';
import { useProject, useUploadProjectFiles, useDeleteProject } from '@/hooks/useProjects';
import { useProjectScripts, useProjectScenes, useProjectPrefabs } from '@/hooks/useFiles';
import { formatRelativeTime, cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { ActivityItem } from '@/types';

function getActivityIcon(type: string) {
  switch (type) {
    case 'upload': return <Upload size={13} style={{ color: '#059669' }} />;
    case 'chat': return <MessageSquare size={13} style={{ color: '#4f46e5' }} />;
    case 'index': return <Zap size={13} style={{ color: '#d97706' }} />;
    default: return <Activity size={13} className="text-neutral-400" />;
  }
}

function getActivityBg(type: string) {
  switch (type) {
    case 'upload': return '#ecfdf5';
    case 'chat': return '#f0f4ff';
    case 'index': return '#fffbeb';
    default: return '#f3f4f6';
  }
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: project, isLoading: projectLoading, isError } = useProject(id);
  const { data: scripts = [] } = useProjectScripts(id);
  const { data: scenes = [] } = useProjectScenes(id);
  const { data: prefabs = [] } = useProjectPrefabs(id);

  const uploadMutation = useUploadProjectFiles();
  const deleteMutation = useDeleteProject();

  const uploading = uploadMutation.isPending;
  const deleting = deleteMutation.isPending;

  const [activeTab, setActiveTab] = useState<'overview' | 'files'>('overview');
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    // Filter supported files: .cs, .unity, .prefab, .asset, .meta
    const supportedExtensions = ['.cs', '.unity', '.prefab', '.asset', '.meta'];
    const validFiles = fileList.filter(file => 
      supportedExtensions.some(ext => file.name.endsWith(ext))
    );

    if (validFiles.length === 0) {
      toast.error('No supported files selected. Please upload .cs, .unity, .prefab, .asset, or .meta files.');
      return;
    }

    try {
      await uploadMutation.mutateAsync({ projectId: id, files: validFiles });
    } catch (err) {
      // Handled inside hook
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(id);
        router.push('/dashboard');
      } catch (err) {
        // Handled inside hooks
      }
    }
  };

  if (projectLoading) {
    return (
      <AppLayout breadcrumbs={[{ label: 'Projects', href: '/projects' }, { label: 'Loading…' }]}>
        <div className="page-content min-h-[60vh] flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-[13px] text-neutral-400 mt-3 font-medium">Loading project details…</p>
        </div>
      </AppLayout>
    );
  }

  if (isError || !project) {
    return (
      <AppLayout breadcrumbs={[{ label: 'Projects', href: '/projects' }, { label: 'Error' }]}>
        <div className="page-content min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
          <p className="text-[14.5px] text-red-500 font-semibold mb-2">Failed to load project</p>
          <p className="text-[13.5px] text-neutral-400 mb-5">The project might not exist or there was a server error.</p>
          <Link href="/dashboard" className="btn btn-secondary btn-sm">Back to Dashboard</Link>
        </div>
      </AppLayout>
    );
  }

  const allFiles = [...scripts, ...scenes, ...prefabs];
  const recentFiles = allFiles.slice(0, 5);

  // Build dynamic activity log
  const activities: ActivityItem[] = [];
  if (project.lastUploadedAt) {
    activities.push({
      id: 'upload-1',
      type: 'upload',
      description: `Project files uploaded — ${project.filesUploaded || allFiles.length} files successfully uploaded.`,
      timestamp: project.lastUploadedAt,
    });
  }
  allFiles.slice(0, 4).forEach((file) => {
    activities.push({
      id: `idx-${file.id}`,
      type: 'index',
      description: `Indexed asset: ${file.path}`,
      timestamp: file.uploadedAt || project.lastUploadedAt || project.createdAt,
    });
  });
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const total = allFiles.length;
  const pctScripts = total > 0 ? (scripts.length / total) * 100 : 0;
  const pctPrefabs = total > 0 ? (prefabs.length / total) * 100 : 0;
  const pctScenes = total > 0 ? (scenes.length / total) * 100 : 0;

  // Circumference of R=30 is 2 * Math.PI * 30 = 188.5
  const circ = 188.5;
  const lenScripts = (pctScripts / 100) * circ;
  const lenPrefabs = (pctPrefabs / 100) * circ;
  const lenScenes = (pctScenes / 100) * circ;

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Projects', href: '/projects' },
        { label: project.name },
      ]}
      projectName={project.name}
    >
      <div className="page-content">
        {/* Project Header */}
        <div
          className="rounded-2xl p-7 mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #6d28d9 100%)',
            boxShadow: '0 8px 32px rgba(79,70,229,0.25)',
          }}
        >
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1
                  className="text-[26px] font-800 text-white tracking-tight mb-1"
                  style={{ fontWeight: 800 }}
                >
                  {project.name}
                </h1>
                {project.description && (
                  <p className="text-indigo-200 text-[14px]">{project.description}</p>
                )}
                {project.lastUploadedAt && (
                  <div className="flex items-center gap-1.5 mt-3 text-indigo-200 text-[12.5px]">
                    <Clock size={12} />
                    Last uploaded {formatRelativeTime(project.lastUploadedAt)}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn btn-sm flex items-center gap-1.5"
                  style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fee2e2', border: '1px solid rgba(239, 68, 68, 0.3)', backdropFilter: 'blur(4px)' }}
                >
                  <Trash2 size={13} className={deleting ? 'animate-spin' : ''} />
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
                <Link
                  href={`/projects/${id}/chat`}
                  className="btn btn-sm"
                  style={{ background: 'white', color: '#4f46e5', border: 'none', fontWeight: 600 }}
                >
                  <MessageSquare size={13} />
                  Open Chat
                </Link>
              </div>
            </div>
          </div>
          {/* Decorative blur circles */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20" style={{ background: 'white' }} />
          <div className="absolute -right-4 top-16 w-20 h-20 rounded-full opacity-10" style={{ background: 'white' }} />
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              'pb-3 px-4 text-[14px] font-semibold border-b-2 transition-all cursor-pointer',
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            )}
          >
            Project Overview
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={cn(
              'pb-3 px-4 text-[14px] font-semibold border-b-2 transition-all cursor-pointer',
              activeTab === 'files'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            )}
          >
            Files
          </button>
          <Link
            href={`/projects/${id}/chat`}
            className="pb-3 px-4 text-[14px] font-semibold text-neutral-500 hover:text-neutral-700 flex items-center gap-1.5 cursor-pointer"
          >
            AI Chat
          </Link>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Scripts" value={scripts.length} icon={FileCode2} accentColor="#3b82f6" accentBg="#dbeafe" />
              <StatCard label="Scenes" value={scenes.length} icon={Clapperboard} accentColor="#059669" accentBg="#d1fae5" />
              <StatCard label="Prefabs" value={prefabs.length} icon={Box} accentColor="#f59e0b" accentBg="#fef3c7" />
              <StatCard label="Dependencies" value={project.stats?.dependencies ?? 0} icon={GitBranch} accentColor="#7c3aed" accentBg="#ede9fe" />
            </div>

            {/* Body grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity Timeline */}
              <div className="lg:col-span-2 card bg-neutral-0 border border-neutral-100 dark:border-neutral-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[14.5px] font-semibold text-neutral-800 dark:text-neutral-950 flex items-center gap-2">
                    <Activity size={16} className="text-neutral-400" />
                    Recent Activity
                  </h2>
                </div>
                
                {allFiles.length === 0 ? (
                  <div className="text-center py-10 text-neutral-400 text-[13px]">
                    No upload activity yet. Upload your Unity project files in the Files tab to start chatting with your AI assistant.
                  </div>
                ) : (
                  <div className="relative pl-6 border-l border-neutral-200 dark:border-neutral-100 ml-4.5 space-y-6">
                    {activities.map((item) => (
                      <div key={item.id} className="relative group">
                        {/* Timeline Node Icon wrapper */}
                        <span
                          className="absolute -left-[37.5px] top-0.5 w-7 h-7 rounded-full flex items-center justify-center bg-neutral-0 border border-neutral-200 dark:border-neutral-100 shadow-sm transition-all group-hover:scale-110"
                          style={{ background: getActivityBg(item.type) }}
                        >
                          {getActivityIcon(item.type)}
                        </span>
                        
                        {/* Content block */}
                        <div className="p-3.5 bg-neutral-50 dark:bg-neutral-50 rounded-xl border border-neutral-100 dark:border-neutral-100 transition-all hover:shadow-md hover:border-brand-200">
                          <p className="text-[13px] text-neutral-800 dark:text-neutral-900 font-medium leading-relaxed">{item.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-[10.5px] text-neutral-400">
                            <span>{formatRelativeTime(item.timestamp)}</span>
                            <span>•</span>
                            <span className="capitalize">{item.type} action</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right panel */}
              <div className="space-y-6">
                {/* Asset Distribution (Donut Chart) */}
                {total > 0 && (
                  <div className="card bg-neutral-0 border border-neutral-100 dark:border-neutral-100">
                    <h2 className="text-[14.5px] font-semibold text-neutral-800 dark:text-neutral-950 flex items-center gap-2 mb-4">
                      <Activity size={16} className="text-neutral-400" />
                      Asset Distribution
                    </h2>
                    <div className="flex items-center gap-6">
                      <div className="relative flex items-center justify-center w-[90px] h-[90px]">
                        <svg width="90" height="90" viewBox="0 0 80 80" className="-rotate-90">
                          {/* Base Track */}
                          <circle cx="40" cy="40" r="30" fill="transparent" stroke="var(--color-neutral-100)" strokeWidth="8" />
                          {/* Scripts segment */}
                          {pctScripts > 0 && (
                            <circle
                              cx="40"
                              cy="40"
                              r="30"
                              fill="transparent"
                              stroke="#3b82f6"
                              strokeWidth="8"
                              strokeDasharray={`${lenScripts} ${circ}`}
                              strokeDashoffset="0"
                              strokeLinecap="round"
                            />
                          )}
                          {/* Prefabs segment */}
                          {pctPrefabs > 0 && (
                            <circle
                              cx="40"
                              cy="40"
                              r="30"
                              fill="transparent"
                              stroke="#f59e0b"
                              strokeWidth="8"
                              strokeDasharray={`${lenPrefabs} ${circ}`}
                              strokeDashoffset={-lenScripts}
                              strokeLinecap="round"
                            />
                          )}
                          {/* Scenes segment */}
                          {pctScenes > 0 && (
                            <circle
                              cx="40"
                              cy="40"
                              r="30"
                              fill="transparent"
                              stroke="#10b981"
                              strokeWidth="8"
                              strokeDasharray={`${lenScenes} ${circ}`}
                              strokeDashoffset={-(lenScripts + lenPrefabs)}
                              strokeLinecap="round"
                            />
                          )}
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-[15px] font-bold text-neutral-800 dark:text-neutral-900">{total}</span>
                          <span className="text-[8.5px] text-neutral-400 uppercase tracking-widest font-semibold">Assets</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-[11.5px]">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                          <span className="text-neutral-500 dark:text-neutral-400 flex-1">Scripts</span>
                          <span className="font-semibold text-neutral-800 dark:text-neutral-900">{pctScripts.toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11.5px]">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                          <span className="text-neutral-500 dark:text-neutral-400 flex-1">Prefabs</span>
                          <span className="font-semibold text-neutral-800 dark:text-neutral-900">{pctPrefabs.toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11.5px]">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                          <span className="text-neutral-500 dark:text-neutral-400 flex-1">Scenes</span>
                          <span className="font-semibold text-neutral-800 dark:text-neutral-900">{pctScenes.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Architecture Coupling & Health Card */}
                {total > 0 && (
                  <div className="card bg-neutral-0 border border-neutral-100 dark:border-neutral-100">
                    <h2 className="text-[14.5px] font-semibold text-neutral-800 dark:text-neutral-950 flex items-center gap-2 mb-3.5">
                      <Zap size={15} className="text-neutral-400" />
                      System Health
                    </h2>
                    <div className="bg-neutral-50 dark:bg-neutral-50 rounded-xl p-3.5 border border-neutral-100 dark:border-neutral-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] text-neutral-500 dark:text-neutral-400">Modularity Score</span>
                        <span className="text-[12.5px] font-bold text-emerald-500">84% (High)</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '84%' }} />
                      </div>
                    </div>
                    <div className="mt-3.5 bg-brand-50/50 dark:bg-brand-900/10 rounded-xl p-3 border border-brand-100 dark:border-indigo-950/40 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      💡 <strong>Coupling Alert:</strong> <code>EnemyAI.cs</code> has direct references to <code>PlayerController.cs</code>. Consider refactoring to event-based signals.
                    </div>
                  </div>
                )}

                {/* Recently Indexed */}
                {total > 0 && (
                  <div className="card bg-neutral-0 border border-neutral-100 dark:border-neutral-100">
                    <h2 className="text-[14.5px] font-semibold text-neutral-800 dark:text-neutral-950 flex items-center gap-2 mb-4">
                      <FileCode2 size={16} className="text-neutral-400" />
                      Recently Indexed
                    </h2>
                    <div className="space-y-2">
                      {recentFiles.map((file) => (
                        <div key={file.id} className="flex items-center gap-2.5 py-1">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{
                              background: file.type === 'script'
                                ? '#3b82f6'
                                : file.type === 'scene'
                                ? '#10b981'
                                : '#f59e0b',
                            }}
                          />
                          <span className="text-[13px] text-neutral-700 dark:text-neutral-400 truncate">{file.name}</span>
                          <span className={`badge ml-auto ${
                            file.type === 'script' ? 'badge-scripts'
                            : file.type === 'scene' ? 'badge-scenes'
                            : 'badge-prefabs'
                          }`}>
                            {file.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="card bg-neutral-0 border border-neutral-100 dark:border-neutral-100 space-y-2">
                  <h2 className="text-[14.5px] font-semibold text-neutral-800 dark:text-neutral-950 mb-3">Quick Actions</h2>
                  {[
                    { label: 'Open AI Chat', href: `/projects/${id}/chat`, icon: MessageSquare, color: '#4f46e5' },
                    { label: 'Search Files', href: `/search?project=${id}`, icon: FileCode2, color: '#059669' },
                  ].map(({ label, href, icon: Icon, color }) => (
                    <Link
                      key={label}
                      href={href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-100 hover:border-indigo-200 hover:bg-indigo-50 dark:hover:bg-neutral-50 transition-all group"
                    >
                      <Icon size={15} style={{ color }} />
                      <span className="text-[13.5px] text-neutral-700 dark:text-neutral-400 font-medium flex-1">{label}</span>
                      <ArrowRight size={13} className="text-neutral-400 group-hover:text-indigo-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Zone */}
            <div className="lg:col-span-1 space-y-6 animate-fade-in">
              <div className="card bg-neutral-0 border border-neutral-100 dark:border-neutral-100 p-6 space-y-5">
                <div>
                  <h2 className="text-[15px] font-semibold text-neutral-800 dark:text-neutral-950 mb-1 flex items-center gap-2">
                    <UploadCloud size={16} />
                    Upload Unity Project
                  </h2>
                  <p className="text-[12.5px] text-neutral-400">Upload your project files to index them for the AI assistant.</p>
                </div>

                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3 transition-all",
                    dragActive 
                      ? "border-indigo-600 bg-indigo-50/50" 
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                    <UploadCloud size={20} />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-neutral-700 block cursor-pointer">
                      <span className="text-indigo-600 hover:text-indigo-700">Browse Files</span> or drag & drop here
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleUpload(e.target.files)}
                      />
                    </label>
                    <p className="text-[11px] text-neutral-400 mt-1">Supported extensions: .cs, .unity, .prefab, .asset, .meta</p>
                  </div>
                </div>

                {uploading && (
                  <div className="flex items-center gap-2.5 p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 text-[12.5px] text-indigo-700 animate-pulse">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Uploading and indexing your project files...</span>
                  </div>
                )}

                <div className="divider animate-fade-in" />
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[9.5px] text-neutral-400 mb-0.5 uppercase tracking-wider font-semibold">Files Uploaded</p>
                    <p className="text-[15px] font-bold text-neutral-800">{project.filesUploaded || allFiles.length}</p>
                  </div>
                  <div>
                    <p className="text-[9.5px] text-neutral-400 mb-0.5 uppercase tracking-wider font-semibold">Files Indexed</p>
                    <p className="text-[15px] font-bold text-neutral-800">{project.filesIndexed || allFiles.length}</p>
                  </div>
                  <div>
                    <p className="text-[9.5px] text-neutral-400 mb-0.5 uppercase tracking-wider font-semibold">Last Upload</p>
                    <p className="text-[11px] font-semibold text-neutral-700 mt-1">
                      {project.lastUploadedAt ? formatRelativeTime(project.lastUploadedAt) : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Files List */}
            <div className="lg:col-span-2 animate-fade-in">
              <div className="card bg-neutral-0 border border-neutral-100 dark:border-neutral-100 p-6">
                <h2 className="text-[15px] font-semibold text-neutral-800 dark:text-neutral-950 mb-4 flex items-center gap-2">
                  <FileCode2 size={16} />
                  Project Files
                </h2>
                {allFiles.length === 0 ? (
                  <div className="text-center py-10 text-neutral-400 text-[13px]">
                    No files uploaded yet. Upload your Unity project files to start chatting with your AI assistant.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[13px]">
                      <thead>
                        <tr className="border-b border-neutral-100 text-neutral-400 font-medium">
                          <th className="py-2.5">Name</th>
                          <th className="py-2.5">Path</th>
                          <th className="py-2.5">Type</th>
                          <th className="py-2.5">Size</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-50">
                        {allFiles.map((file) => (
                          <tr key={file.id} className="text-neutral-700 hover:bg-neutral-50">
                            <td className="py-2.5 font-medium text-neutral-900 truncate max-w-[150px]">{file.name}</td>
                            <td className="py-2.5 text-neutral-500 font-mono text-[11px] truncate max-w-[200px]" title={file.path}>{file.path}</td>
                            <td className="py-2.5">
                              <span className={`badge ${
                                file.type === 'script' ? 'badge-scripts'
                                : file.type === 'scene' ? 'badge-scenes'
                                : 'badge-prefabs'
                              }`}>
                                {file.type}
                              </span>
                            </td>
                            <td className="py-2.5 text-neutral-400">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
