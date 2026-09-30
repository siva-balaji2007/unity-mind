import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/api';
import { toast } from 'sonner';

export function useChatSessions(projectId: string) {
  return useQuery({
    queryKey: ['chat-sessions', projectId],
    queryFn: () => chatService.getSessions(projectId),
    enabled: !!projectId,
  });
}

export function useChatSession(sessionId: string) {
  return useQuery({
    queryKey: ['chat-session', sessionId],
    queryFn: () => chatService.getSession(sessionId),
    enabled: !!sessionId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      message,
      sessionId,
    }: {
      projectId: string;
      message: string;
      sessionId?: string;
    }) => chatService.sendMessage(projectId, message, sessionId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['chat-session', data.sessionId] });
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || 'Failed to send message';
      toast.error(errMsg);
    },
  });
}
