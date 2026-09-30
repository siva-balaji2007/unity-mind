import { type LucideIcon, TrendingUp } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  trend?: { value: number; label: string };
  accentColor?: string;
  accentBg?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accentColor = '#6366f1',
  accentBg = '#f0f4ff',
  className,
}: StatCardProps) {
  return (
    <div className={cn('stat-card flex items-center gap-4', className)}>
      {Icon && (
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accentBg }}
        >
          <Icon size={18} style={{ color: accentColor }} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[12px] text-neutral-500 font-medium">{label}</p>
        <p className="text-[22px] font-700 text-neutral-900 leading-tight" style={{ fontWeight: 700 }}>
          {typeof value === 'number' ? formatNumber(value) : value}
        </p>
        {trend && (
          <p className="text-[11px] text-emerald-600 flex items-center gap-0.5 mt-0.5">
            <TrendingUp size={10} />
            {trend.value}% {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}
