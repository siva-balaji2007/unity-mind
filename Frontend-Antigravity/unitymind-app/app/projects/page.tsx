'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { NewProjectModal } from '@/components/projects/NewProjectModal';
import { EmptyProjects } from '@/components/ui/EmptyState';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import { ProjectCardSkeleton } from '@/components/ui/Skeleton';

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();
  const createMutation = useCreateProject();
  const [modalOpen, setModalOpen] = useState(false);
  const filtered = projects;

  const handleNewProject = async (data: { name: string; description: string; unityVersion: string }) => {
    try {
      await createMutation.mutateAsync(data);
      setModalOpen(false);
    } catch (err) {
      // Errors are handled inside mutation hooks
    }
  };

  return (
    <AppLayout breadcrumbs={[{ label: 'Projects' }]}>
      <div className="page-content">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[22px] font-700 text-neutral-900 tracking-tight" style={{ fontWeight: 700 }}>
            Projects
          </h1>
          <button onClick={() => setModalOpen(true)} className="btn btn-primary">
            <Plus size={15} />
            New Project
          </button>
        </div>

        {/* Filters removed */}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyProjects onNew={() => setModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project) => (
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
