import apiClient from '@/lib/axios';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Project,
  ProjectFile,
  ChatResponse,
  SearchResult,
  UploadResponse,
  ChatSession,
  User,
} from '@/types';

// ─────────── Auth ───────────
export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed', err);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('unitymind_token');
        localStorage.removeItem('unitymind_user');
      }
    }
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },
};

// ─────────── Projects ───────────
export const projectService = {
  getAll: async (): Promise<Project[]> => {
    const res = await apiClient.get<Project[]>('/projects');
    return res.data;
  },

  getById: async (id: string): Promise<Project> => {
    const res = await apiClient.get<Project>(`/projects/${id}`);
    return res.data;
  },

  create: async (data: { name: string; description: string; unityVersion: string }): Promise<Project> => {
    const res = await apiClient.post<Project>('/projects', data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  uploadFiles: async (id: string, files: File[]): Promise<UploadResponse> => {
    const formData = new FormData();
    files.forEach((f) => {
      formData.append('files', f);
    });
    const res = await apiClient.post<UploadResponse>(`/projects/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

// ─────────── Scripts, Scenes, Prefabs ───────────
export const fileService = {
  getScripts: async (projectId: string): Promise<ProjectFile[]> => {
    const res = await apiClient.get<ProjectFile[]>(`/projects/${projectId}/scripts`);
    return res.data;
  },

  getScriptDetails: async (scriptId: string): Promise<ProjectFile> => {
    const res = await apiClient.get<ProjectFile>(`/scripts/${scriptId}`);
    return res.data;
  },

  getScenes: async (projectId: string): Promise<ProjectFile[]> => {
    const res = await apiClient.get<ProjectFile[]>(`/projects/${projectId}/scenes`);
    return res.data;
  },

  getPrefabs: async (projectId: string): Promise<ProjectFile[]> => {
    const res = await apiClient.get<ProjectFile[]>(`/projects/${projectId}/prefabs`);
    return res.data;
  },
};

// ─────────── Search ───────────
export const searchService = {
  search: async (projectId: string, query: string): Promise<SearchResult[]> => {
    const res = await apiClient.get<SearchResult[]>(`/projects/${projectId}/search`, {
      params: { q: query },
    });
    return res.data;
  },
};

// ─────────── Chat ───────────
export const chatService = {
  sendMessage: async (projectId: string, message: string, sessionId?: string): Promise<ChatResponse> => {
    const res = await apiClient.post<ChatResponse>(`/projects/${projectId}/chat`, {
      message,
      sessionId,
    });
    return res.data;
  },

  getSessions: async (projectId: string): Promise<ChatSession[]> => {
    const res = await apiClient.get<ChatSession[]>(`/projects/${projectId}/chat/sessions`);
    return res.data;
  },

  getSession: async (sessionId: string): Promise<ChatSession> => {
    const res = await apiClient.get<ChatSession>(`/chat/sessions/${sessionId}`);
    return res.data;
  },
};
