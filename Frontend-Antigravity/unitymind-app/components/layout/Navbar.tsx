'use client';

import { Bell, ChevronRight, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/app/providers';
import { useAuth } from '@/lib/AuthContext';

interface NavbarProps {
  projectName?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function Navbar({
  projectName,
  breadcrumbs,
}: NavbarProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const { user } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="navbar bg-neutral-0 border-b border-neutral-100 dark:bg-neutral-50 dark:border-neutral-100">
      {/* Breadcrumb / Project name */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={13} className="text-neutral-400 flex-shrink-0" />}
                <span className={cn(
                  i === breadcrumbs.length - 1
                    ? 'text-neutral-900 font-medium'
                    : 'text-neutral-500 hover:text-neutral-700 cursor-pointer'
                )}>
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        ) : projectName ? (
          <h1 className="text-[14px] font-semibold text-neutral-900 truncate">{projectName}</h1>
        ) : null}
      </div>

      {/* Sync status removed */}

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-all"
          title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {resolvedTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button className="relative w-8 h-8 rounded-md flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-all">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-600" style={{ background: '#4f46e5' }} />
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #e0eaff, #c7d7fd)' }}
          title={user?.name || 'User Profile'}
        >
          <span className="text-xs font-semibold" style={{ color: '#4338ca' }}>{initial}</span>
        </div>
      </div>
    </header>
  );
}
