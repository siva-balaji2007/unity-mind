'use client';

import { useState } from 'react';
import { Plus, FolderOpen, Upload, MessageSquare, Zap, FileCode2, Clapperboard, Box } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { NewProjectModal } from '@/components/projects/NewProjectModal';
import { EmptyProjects } from '@/components/ui/EmptyState';
import { ProjectCardSkeleton } from '@/components/ui/Skeleton';
import { StatCard } from '@/components/ui/StatCard';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import { toast } from 'sonner';

const QUICK_ACTIONS = [
  { icon: FolderOpen, label: 'Open Project', description: 'View your latest project', color: '#4f46e5', bg: '#f0f4ff' },
  { icon: Upload, label: 'Upload Files', description: 'Upload Unity project files', color: '#059669', bg: '#ecfdf5' },
  { icon: MessageSquare, label: 'New Chat', description: 'Start a conversation', color: '#7c3aed', bg: '#f5f3ff' },
  { icon: Zap, label: 'Quick Search', description: 'Search across all projects', color: '#d97706', bg: '#fffbeb' },
];

export default function DashboardPage() {
  const { data: projects = [], isLoading: loading } = useProjects();
  const createMutation = useCreateProject();
  const [modalOpen, setModalOpen] = useState(false);

  const totalStats = projects.reduce(
    (acc, p) => ({
      scripts: acc.scripts + (p.stats?.scripts || 0),
      scenes: acc.scenes + (p.stats?.scenes || 0),
      prefabs: acc.prefabs + (p.stats?.prefabs || 0),
    }),
    { scripts: 0, scenes: 0, prefabs: 0 }
  );

  const handleNewProject = async (data: { name: string; description: string; unityVersion: string }) => {
    try {
      await createMutation.mutateAsync(data);
      setModalOpen(false);
    } catch (err) {
      // toast notification is handled inside mutation
    }
  };

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="page-content">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[22px] font-700 text-neutral-900 tracking-tight" style={{ fontWeight: 700 }}>
              My Projects
            </h1>
            <p className="text-[13.5px] text-neutral-500 mt-0.5">
              {projects.length} project{projects.length !== 1 ? 's' : ''} · {projects.filter(p => p.filesUploaded > 0).length} uploaded
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="btn btn-primary"
            id="new-project-btn"
          >
            <Plus size={15} />
            New Project
          </button>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Projects"
            value={projects.length}
            icon={FolderOpen}
            accentColor="#4f46e5"
            accentBg="#f0f4ff"
          />
          <StatCard
            label="Scripts Indexed"
            value={totalStats.scripts}
            icon={FileCode2}
            accentColor="#7c3aed"
            accentBg="#f5f3ff"
          />
          <StatCard
            label="Scenes"
            value={totalStats.scenes}
            icon={Clapperboard}
            accentColor="#059669"
            accentBg="#ecfdf5"
          />
          <StatCard
            label="Prefabs"
            value={totalStats.prefabs}
            icon={Box}
            accentColor="#d97706"
            accentBg="#fffbeb"
          />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="card card-hover text-left p-4 cursor-pointer"
                onClick={() => {
                  if (action.label === 'New Chat') {
                    if (projects.length > 0) {
                      window.location.href = `/projects/${projects[0].id}/chat`;
                    } else {
                      toast.error('Please create a project first.');
                    }
                  } else if (action.label === 'Open Project') {
                    if (projects.length > 0) {
                      window.location.href = `/projects/${projects[0].id}`;
                    } else {
                      toast.error('Please create a project first.');
                    }
                  } else if (action.label === 'Quick Search') {
                    if (projects.length > 0) {
                      window.location.href = `/search?project=${projects[0].id}`;
                    } else {
                      window.location.href = `/search`;
                    }
                  } else if (action.label === 'Upload Files') {
                    if (projects.length > 0) {
                      window.location.href = `/projects/${projects[0].id}?tab=files`;
                    } else {
                      toast.error('Please create a project first.');
                    }
                  }
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: action.bg }}
                >
                  <Icon size={16} style={{ color: action.color }} />
                </div>
                <p className="text-[13px] font-semibold text-neutral-800">{action.label}</p>
                <p className="text-[12px] text-neutral-400 mt-0.5">{action.description}</p>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-[14px] font-semibold text-neutral-700">All Projects</h2>
          <div className="flex-1 h-px bg-neutral-100" />
        </div>

        {/* Project grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyProjects onNew={() => setModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      <NewProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewProject}
      />
    </AppLayout>
  );
}
