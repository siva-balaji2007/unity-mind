'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/settings', label: 'Settings', icon: Settings },
];

import { useAuth } from '@/lib/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <aside
      className={cn(
        'sidebar',
        collapsed && 'collapsed'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-200 overflow-hidden">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
          <Zap size={16} color="white" fill="white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <p className="text-[14px] font-700 text-neutral-900 leading-tight tracking-tight"
              style={{ fontWeight: 700 }}>
              UnityMind
            </p>
            <p className="text-[11px] text-neutral-400 leading-tight">AI for Unity</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn('sidebar-nav-item', isActive && 'active')}
              title={collapsed ? label : undefined}
            >
              <Icon size={17} className="icon flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className={cn(
        'border-t border-neutral-200 p-3',
        collapsed ? 'flex justify-center' : ''
      )}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #e0eaff, #c7d7fd)' }}
            title={user?.name || 'User Profile'}
          >
            <span className="text-xs font-semibold text-brand-700" style={{ color: '#4338ca' }}>{initial}</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 animate-fade-in cursor-pointer group rounded-lg p-2 hover:bg-neutral-100 transition-colors"
            title={user?.name || 'User Profile'}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #e0eaff, #c7d7fd)' }}>
              <span className="text-xs font-semibold" style={{ color: '#4338ca' }}>{initial}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] font-medium text-neutral-800 truncate">{user?.name || 'Guest User'}</p>
              <p className="text-[11px] text-neutral-400 truncate">{user?.email || 'guest@example.com'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-neutral-0 border border-neutral-200 flex items-center justify-center shadow-sm hover:bg-neutral-50 transition-all z-50"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
      >
        {collapsed
          ? <ChevronRight size={12} className="text-neutral-500" />
          : <ChevronLeft size={12} className="text-neutral-500" />}
      </button>
    </aside>
  );
}
