import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('skeleton', className)} />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="h-5 w-8" />
          </div>
        ))}
      </div>
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card space-y-2">
      <Skeleton className="h-3.5 w-20" />
      <Skeleton className="h-7 w-16" />
    </div>
  );
}

export function ChatMessageSkeleton() {
  return (
    <div className="space-y-3 px-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-start' : 'justify-end')}>
          <Skeleton className={cn('h-16 rounded-2xl', i % 2 === 0 ? 'w-64' : 'w-48')} />
        </div>
      ))}
    </div>
  );
}

export function SearchResultSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="search-result-card space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-16 rounded-full ml-auto" />
          </div>
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-1.5 pt-1">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
