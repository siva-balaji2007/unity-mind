'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Bell,
  Palette,
  FolderOpen,
  Save,
  Trash2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useProjects, useDeleteProject } from '@/hooks/useProjects';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import { cn, formatRelativeTime } from '@/lib/utils';
import { useTheme } from '@/app/providers';

type SettingsTab = 'account' | 'preferences' | 'projects';

const TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Palette },
  { id: 'projects', label: 'Connected Projects', icon: FolderOpen },
] as const;

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { data: projects = [] } = useProjects();
  const deleteMutation = useDeleteProject();

  const [tab, setTab] = useState<SettingsTab>('account');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    uploadComplete: true,
    chatResponse: false,
    weekly: true,
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate updating details on backend (usually PUT /users/me)
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success('Settings saved');
  };

  const handleDisconnect = async (projectId: string) => {
    if (window.confirm('Are you sure you want to disconnect and delete this project?')) {
      try {
        await deleteMutation.mutateAsync(projectId);
      } catch (err) {
        // Handled inside hook
      }
    }
  };

  return (
    <AppLayout breadcrumbs={[{ label: 'Settings' }]}>
      <div className="page-content max-w-4xl">
        <h1
          className="text-[22px] font-700 text-neutral-900 tracking-tight mb-8"
          style={{ fontWeight: 700 }}
        >
          Settings
        </h1>

        <div className="flex gap-8">
          {/* Sidebar tabs */}
          <div className="w-44 flex-shrink-0">
            <nav className="space-y-0.5">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id as SettingsTab)}
                  className={cn(
                    'sidebar-nav-item w-full',
                    tab === id && 'active'
                  )}
                >
                  <Icon size={15} className="icon" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* ─────── Account ─────── */}
            {tab === 'account' && (
              <div className="card space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-[15px] font-semibold text-neutral-900 mb-1">Account Information</h2>
                  <p className="text-[13px] text-neutral-500">Update your personal details.</p>
                </div>
                <div className="divider" />

                {/* Avatar */}
                <div className="flex items-center gap-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-[24px] font-700"
                    style={{ background: 'linear-gradient(135deg, #e0eaff, #c7d7fd)', fontWeight: 700, color: '#4338ca' }}
                  >
                    {name.charAt(0)}
                  </div>
                  <div>
                    <button className="btn btn-secondary btn-sm">Change avatar</button>
                    <p className="text-[12px] text-neutral-400 mt-1.5">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-base max-w-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-base max-w-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">Password</label>
                  <button className="btn btn-secondary btn-sm">Change password</button>
                </div>

                <div className="divider" />

                {/* Danger zone */}
                <div>
                  <h3 className="text-[13.5px] font-semibold text-red-600 mb-3 flex items-center gap-2">
                    <Trash2 size={14} />
                    Danger Zone
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="btn btn-sm"
                      style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
                      onClick={() => toast.error('Account deletion requires confirmation — feature coming soon')}
                    >
                      Delete Account
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        logout();
                        toast.success('Logged out successfully');
                      }}
                    >
                      Log Out
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary"
                  >
                    <Save size={14} />
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* ─────── Preferences ─────── */}
            {tab === 'preferences' && (
              <div className="card space-y-7 animate-fade-in">
                <div>
                  <h2 className="text-[15px] font-semibold text-neutral-900 mb-1">Preferences</h2>
                  <p className="text-[13px] text-neutral-500">Customize your UnityMind experience.</p>
                </div>
                <div className="divider" />

                {/* Theme */}
                <div>
                  <h3 className="text-[13.5px] font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                    <Palette size={14} />
                    Theme
                  </h3>
                  <div className="flex gap-3">
                    {(['light', 'dark', 'system'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTheme(t);
                          toast.success(`Theme updated to ${t}`);
                        }}
                        className={cn(
                          'flex-1 py-3 rounded-xl border-2 text-[13px] font-medium capitalize transition-all cursor-pointer',
                          theme === t
                            ? 'border-indigo-500 bg-brand-50 text-brand-700 dark:bg-indigo-950/20 dark:text-indigo-400'
                            : 'border-neutral-200 dark:border-neutral-100 text-neutral-500 hover:border-neutral-300 dark:hover:border-neutral-200'
                        )}
                      >
                        {t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '🖥️'} {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divider" />

                {/* Notifications */}
                <div>
                  <h3 className="text-[13.5px] font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                    <Bell size={14} />
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'uploadComplete', label: 'Upload complete', desc: 'Get notified when project file indexing finishes' },
                      { key: 'chatResponse', label: 'Chat responses', desc: 'Notifications for AI responses when away' },
                      { key: 'weekly', label: 'Weekly digest', desc: 'Weekly summary of project activity' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[13.5px] font-medium text-neutral-800">{label}</p>
                          <p className="text-[12.5px] text-neutral-500">{desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                          className={cn(
                            'relative flex-shrink-0 w-10 h-5.5 rounded-full transition-all mt-0.5',
                            notifications[key as keyof typeof notifications]
                              ? 'bg-indigo-600'
                              : 'bg-neutral-200'
                          )}
                          style={{
                            width: '40px',
                            height: '22px',
                            background: notifications[key as keyof typeof notifications] ? '#4f46e5' : '#e5e7eb',
                          }}
                        >
                          <span
                            className="absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform"
                            style={{
                              transform: notifications[key as keyof typeof notifications]
                                ? 'translateX(18px)'
                                : 'translateX(0)',
                            }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                    <Save size={14} />
                    {saving ? 'Saving…' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {/* ─────── Connected Projects ─────── */}
            {tab === 'projects' && (
              <div className="card animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-[15px] font-semibold text-neutral-900 mb-1">My Projects</h2>
                    <p className="text-[13px] text-neutral-500">{projects.length} projects uploaded</p>
                  </div>
                </div>
                <div className="divider mb-5" />

                <div className="space-y-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-4 py-3 px-4 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #f0f4ff, #e0eaff)' }}
                      >
                        <FolderOpen size={16} style={{ color: '#4f46e5' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] font-medium text-neutral-800 truncate">
                          {project.name}
                        </p>
                        <p className="text-[12px] text-neutral-400">
                          {project.lastUploadedAt
                            ? `Uploaded ${formatRelativeTime(project.lastUploadedAt)}`
                            : 'No uploads'}
                          {' · '}
                          {project.filesIndexed || 0} files indexed
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.filesIndexed > 0 && (
                          <CheckCircle2 size={14} className="text-emerald-500" />
                        )}
                        <a
                          href={`/projects/${project.id}`}
                          className="btn btn-ghost btn-sm text-neutral-500"
                        >
                          <ExternalLink size={13} />
                        </a>
                        <button
                          className="btn btn-ghost btn-sm text-red-400 hover:text-red-600"
                          onClick={() => handleDisconnect(project.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
