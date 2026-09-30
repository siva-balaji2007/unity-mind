import Link from 'next/link';
import { ArrowRight, Clock, CheckCircle2, XCircle, Minus } from 'lucide-react';
import { cn, formatRelativeTime, formatNumber } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

// SyncBadge removed

export function ProjectCard({ project }: ProjectCardProps) {
  const stats = [
    { label: 'Scripts', value: project.stats?.scripts ?? 0, badgeClass: 'badge-scripts' },
    { label: 'Scenes', value: project.stats?.scenes ?? 0, badgeClass: 'badge-scenes' },
    { label: 'Prefabs', value: project.stats?.prefabs ?? 0, badgeClass: 'badge-prefabs' },
    { label: 'Deps', value: project.stats?.dependencies ?? 0, badgeClass: 'badge-deps' },
  ];

  return (
    <div className={cn('card card-hover flex flex-col gap-4 group')}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[14.5px] font-semibold text-neutral-900 truncate leading-tight">
            {project.name}
          </h3>
          {project.lastUploadedAt ? (
            <p className="text-[12px] text-neutral-400 mt-0.5 flex items-center gap-1">
              <Clock size={10} />
              Uploaded {formatRelativeTime(project.lastUploadedAt)}
            </p>
          ) : (
            <p className="text-[12px] text-neutral-400 mt-0.5">No uploads</p>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map(({ label, value, badgeClass }) => (
          <div key={label} className="text-center">
            <p className="text-[11px] text-neutral-400 mb-0.5">{label}</p>
            <span className={cn('badge', badgeClass, 'text-[12px] font-semibold')}>
              {formatNumber(value)}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href={`/projects/${project.id}`}
        className="btn btn-secondary w-full group-hover:border-brand-300 text-[13px]"
        style={{ justifyContent: 'space-between' }}
      >
        <span>Open Project</span>
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
