'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
interface AppLayoutProps {
  children: React.ReactNode;
  projectName?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

import { ProtectedRoute } from './ProtectedRoute';

export function AppLayout({
  children,
  projectName,
  breadcrumbs,
}: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-50 text-neutral-900">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <div
          className="main-content"
          style={{
            marginLeft: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
            transition: 'margin-left 200ms ease',
          }}
        >
          <Navbar
            projectName={projectName}
            breadcrumbs={breadcrumbs}
          />
          <main className="animate-fade-in">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
