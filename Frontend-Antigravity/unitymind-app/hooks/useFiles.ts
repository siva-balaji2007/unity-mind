import { useQuery } from '@tanstack/react-query';
import { fileService } from '@/services/api';

export function useProjectScripts(projectId: string) {
  return useQuery({
    queryKey: ['files', projectId, 'scripts'],
    queryFn: () => fileService.getScripts(projectId),
    enabled: !!projectId,
  });
}

export function useScriptDetails(scriptId: string) {
  return useQuery({
    queryKey: ['script-details', scriptId],
    queryFn: () => fileService.getScriptDetails(scriptId),
    enabled: !!scriptId,
  });
}

export function useProjectScenes(projectId: string) {
  return useQuery({
    queryKey: ['files', projectId, 'scenes'],
    queryFn: () => fileService.getScenes(projectId),
    enabled: !!projectId,
  });
}

export function useProjectPrefabs(projectId: string) {
  return useQuery({
    queryKey: ['files', projectId, 'prefabs'],
    queryFn: () => fileService.getPrefabs(projectId),
    enabled: !!projectId,
  });
}
