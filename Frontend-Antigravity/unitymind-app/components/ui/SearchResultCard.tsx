import { FileCode2, Clapperboard, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SearchResult } from '@/types';

const TYPE_CONFIG = {
  script: { icon: FileCode2, label: 'Script', badgeClass: 'badge-scripts', color: '#3b82f6' },
  scene: { icon: Clapperboard, label: 'Scene', badgeClass: 'badge-scenes', color: '#10b981' },
  prefab: { icon: Box, label: 'Prefab', badgeClass: 'badge-prefabs', color: '#f59e0b' },
};

interface SearchResultCardProps {
  result: SearchResult;
  query?: string;
  onClick?: (result: SearchResult) => void;
}

function highlight(text: string, query?: string) {
  if (!query) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-100 text-yellow-800 rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function SearchResultCard({ result, query, onClick }: SearchResultCardProps) {
  const cfg = TYPE_CONFIG[result.type];
  const Icon = cfg.icon;

  return (
    <div
      className="search-result-card animate-fade-in cursor-pointer"
      onClick={() => onClick?.(result)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
          style={{ background: `${cfg.color}18` }}
        >
          <Icon size={15} style={{ color: cfg.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-[14px] font-medium text-neutral-900">
              {highlight(result.name, query)}
            </span>
            <span className={cn('badge', cfg.badgeClass)}>{cfg.label}</span>
          </div>
          <p className="text-[12px] text-neutral-400 font-mono mb-1 truncate" title={result.path}>
            {result.path}
          </p>
          <p className="text-[13px] text-neutral-600 leading-relaxed">
            {highlight(result.description, query)}
          </p>
        </div>
      </div>
    </div>
  );
}
