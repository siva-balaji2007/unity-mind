import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/api';
import { toast } from 'sonner';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getAll,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(`Project "${data.name}" created successfully. Upload your Unity project files to begin indexing.`);
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || 'Failed to create project';
      toast.error(errMsg);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectService.delete,
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || 'Failed to delete project';
      toast.error(errMsg);
    },
  });
}

export function useUploadProjectFiles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, files }: { projectId: string; files: File[] }) =>
      projectService.uploadFiles(projectId, files),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['files', variables.projectId] });
      toast.success(data.message || 'Project files uploaded successfully!');
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || 'Upload failed';
      toast.error(errMsg);
    },
  });
}
