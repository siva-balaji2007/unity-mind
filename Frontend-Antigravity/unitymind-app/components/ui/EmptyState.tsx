import { FolderOpen, Search, MessageSquare, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon = FolderOpen, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state animate-fade-in">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2"
        style={{ background: 'linear-gradient(135deg, #f0f4ff, #e0eaff)' }}
      >
        <Icon size={24} style={{ color: '#6366f1' }} />
      </div>
      <h3 className="text-[15px] font-semibold text-neutral-800">{title}</h3>
      <p className="text-[13.5px] text-neutral-500 max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function EmptyProjects({ onNew }: { onNew: () => void }) {
  return (
    <EmptyState
      icon={FolderOpen}
      title="No projects yet"
      description="Connect your first Unity project to get started with AI-powered code understanding."
      action={
        <button className="btn btn-primary mt-2" onClick={onNew}>
          + New Project
        </button>
      }
    />
  );
}

export function EmptySearch() {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description="Try adjusting your search query or filters to find what you're looking for."
    />
  );
}

export function EmptyChat() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="Start a conversation"
      description="Ask me anything about your Unity project — scripts, scenes, prefabs, or architecture."
    />
  );
}
