'use client';

import { useParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChatList } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { ProjectExplorer } from '@/components/chat/ProjectExplorer';
import { EmptyChat } from '@/components/ui/EmptyState';
import { useProject } from '@/hooks/useProjects';
import { useProjectScripts, useProjectScenes, useProjectPrefabs } from '@/hooks/useFiles';
import { useChatSessions, useChatSession, useSendMessage } from '@/hooks/useChat';
import type { ProjectFile } from '@/types';
import { toast } from 'sonner';

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading: projectLoading } = useProject(id);
  const { data: scripts = [] } = useProjectScripts(id);
  const { data: scenes = [] } = useProjectScenes(id);
  const { data: prefabs = [] } = useProjectPrefabs(id);
  const files = [...scripts, ...scenes, ...prefabs];

  const { data: sessions = [] } = useChatSessions(id);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>();
  const { data: activeSession, isLoading: sessionLoading } = useChatSession(activeSessionId || '');

  const sendMessageMutation = useSendMessage();

  const [selectedFile, setSelectedFile] = useState<ProjectFile | undefined>();

  // Default to the first session if available and none selected
  useEffect(() => {
    if (!activeSessionId && sessions.length > 0) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      try {
        const response = await sendMessageMutation.mutateAsync({
          projectId: id,
          message: content,
          sessionId: activeSessionId,
        });

        // Set the active session to the new session created by the backend
        if (!activeSessionId) {
          setActiveSessionId(response.sessionId);
        }
      } catch (err) {
        // Error toast is handled inside the hook
      }
    },
    [id, activeSessionId, sendMessageMutation]
  );

  const clearChat = () => {
    setActiveSessionId(undefined);
    toast.success('Conversation cleared');
  };

  const handleFileSelect = (file: ProjectFile) => {
    setSelectedFile(file);
    sendMessage(`Tell me about \`${file.name}\` at \`${file.path}\``);
  };

  if (projectLoading) {
    return (
      <AppLayout breadcrumbs={[{ label: 'Projects', href: '/projects' }, { label: 'Loading…' }]}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-[13px] text-neutral-400 mt-3 font-medium">Loading project workspace…</p>
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout breadcrumbs={[{ label: 'Projects', href: '/projects' }, { label: 'Error' }]}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white text-center p-6">
          <p className="text-[14.5px] text-red-500 font-semibold mb-2">Failed to load project chat</p>
          <p className="text-[13.5px] text-neutral-400">The project was not found.</p>
        </div>
      </AppLayout>
    );
  }

  const sessionMessages = activeSession ? activeSession.messages : [];
  const displayMessages = [...sessionMessages];

  // Optimistic UI updates while waiting for the AI response
  if (sendMessageMutation.isPending && sendMessageMutation.variables) {
    displayMessages.push({
      id: 'optimistic-user-msg',
      role: 'user',
      content: sendMessageMutation.variables.message,
      timestamp: new Date().toISOString(),
    });
  }

  const isTyping = sendMessageMutation.isPending || sessionLoading;

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Projects', href: '/projects' },
        { label: project.name, href: `/projects/${id}` },
        { label: 'Chat' },
      ]}
      projectName={project.name}
    >
      <div
        className="flex overflow-hidden"
        style={{ height: 'calc(100vh - var(--navbar-height))' }}
      >
        {/* Left: Project Explorer */}
        <div
          className="w-56 flex-shrink-0 border-r border-neutral-200 bg-white overflow-hidden flex flex-col"
          style={{ minWidth: '200px' }}
        >
          <ProjectExplorer
            files={files}
            onFileSelect={handleFileSelect}
            selectedFileId={selectedFile?.id}
          />
        </div>

        {/* Right: Chat */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-[14px] font-semibold text-neutral-800">{project.name}</h2>
                {sessions.length > 0 && (
                  <select
                    value={activeSessionId || ''}
                    onChange={(e) => setActiveSessionId(e.target.value || undefined)}
                    className="text-[11.5px] bg-neutral-50 border border-neutral-200 rounded px-1.5 py-0.5 outline-none focus:border-brand-400 text-neutral-600"
                  >
                    <option value="">-- New Session --</option>
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title || `Session ${s.id.substring(0, 5)}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <p className="text-[11.5px] text-neutral-400">
                {displayMessages.length} message{displayMessages.length !== 1 ? 's' : ''} in this session
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="btn btn-ghost btn-sm text-neutral-500 hover:text-red-500"
                title="Clear conversation"
              >
                <Trash2 size={14} />
                Clear
              </button>
              <button
                onClick={() => setActiveSessionId(undefined)}
                className="btn btn-secondary btn-sm"
                title="New conversation"
              >
                <Plus size={14} />
                New
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {displayMessages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <EmptyChat />
              </div>
            ) : (
              <ChatList messages={displayMessages} isTyping={isTyping} />
            )}
          </div>

          {/* Input */}
          <ChatInput
            onSend={sendMessage}
            disabled={isTyping}
            showSuggestions={displayMessages.length === 0}
          />
        </div>
      </div>
    </AppLayout>
  );
}
