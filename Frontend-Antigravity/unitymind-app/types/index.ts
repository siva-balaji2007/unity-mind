// ============================================================
// UnityMind – Shared TypeScript Types
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  unityVersion: string;
  description?: string;
  lastUploadedAt?: string;
  filesUploaded: number;
  filesIndexed: number;
  stats?: ProjectStats;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStats {
  scripts: number;
  scenes: number;
  prefabs: number;
  dependencies: number;
}

export interface ProjectFile {
  id: string;
  projectId?: string;
  name: string;
  type: 'script' | 'scene' | 'prefab' | 'asset' | 'meta';
  path: string;
  size?: number;
  content?: string;
  uploadedAt?: string;
  indexedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  fileReferences?: string[];
}

export interface ChatSession {
  id: string;
  projectId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  id: string;
  name: string;
  type: 'script' | 'scene' | 'prefab';
  path: string;
  description: string;
  relevanceScore?: number;
}

export interface ActivityItem {
  id: string;
  type: 'upload' | 'chat' | 'index';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ChatRequest {
  projectId: string;
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  message: ChatMessage;
  sessionId: string;
}

export interface SearchRequest {
  projectId: string;
  query: string;
  filter?: 'all' | 'script' | 'scene' | 'prefab';
}

export interface UploadResponse {
  message: string;
  filesUploaded: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export type FileType = 'script' | 'scene' | 'prefab' | 'asset' | 'meta';
export type SearchFilter = 'all' | 'script' | 'scene' | 'prefab' | 'asset' | 'meta';
