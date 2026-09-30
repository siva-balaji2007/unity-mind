'use client';

import { useState } from 'react';
import { X, FolderOpen, Loader2 } from 'lucide-react';

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; unityVersion: string }) => Promise<void>;
}

export function NewProjectModal({ open, onClose, onSubmit }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unityVersion, setUnityVersion] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !unityVersion.trim()) return;
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        unityVersion: unityVersion.trim(),
      });
      setName('');
      setDescription('');
      setUnityVersion('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in"
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.18)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f0f4ff, #e0eaff)' }}
            >
              <FolderOpen size={17} style={{ color: '#4f46e5' }} />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-neutral-900">New Project</h2>
              <p className="text-[12px] text-neutral-400">Connect a Unity project to UnityMind</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-base"
              placeholder="e.g. Stellar Runner"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
              Unity Version <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={unityVersion}
              onChange={(e) => setUnityVersion(e.target.value)}
              className="input-base"
              placeholder="e.g. 2022.3.15f1"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
              Description <span className="text-neutral-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-base resize-none"
              placeholder="Brief description of your Unity project"
              rows={3}
              style={{ fontFamily: 'inherit' }}
            />
          </div>

          <div
            className="rounded-xl p-4 text-[13px]"
            style={{ background: '#f0f4ff', border: '1px solid #e0eaff' }}
          >
            <p className="font-medium text-indigo-800 mb-1">📤 Upload Your Unity Project</p>
            <p className="text-indigo-600 text-[12.5px] leading-relaxed">
              After creating your project, you can drag and drop your project folders or files directly in the browser to start indexing and enable AI chat.
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="btn btn-primary flex-1"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
