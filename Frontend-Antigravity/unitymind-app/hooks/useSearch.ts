import { useQuery } from '@tanstack/react-query';
import { searchService } from '@/services/api';

export function useProjectSearch(projectId: string, query: string) {
  return useQuery({
    queryKey: ['search', projectId, query],
    queryFn: () => searchService.search(projectId, query),
    enabled: !!projectId && query.trim().length > 0,
  });
}
