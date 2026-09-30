'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/api';
import type { User, LoginRequest, RegisterRequest } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      toast.success('Logged out successfully');
    }
  }, []);

  // Initialize: load token and fetch current user profile
  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === 'undefined') return;
      const savedToken = localStorage.getItem('unitymind_token');
      if (savedToken) {
        try {
          setToken(savedToken);
          // Fetch current user details from server
          const currentUser = await authService.getMe();
          setUser(currentUser);
          localStorage.setItem('unitymind_user', JSON.stringify(currentUser));
        } catch (err) {
          console.error('Failed to restore session:', err);
          // Token is invalid/expired - clean up
          localStorage.removeItem('unitymind_token');
          localStorage.removeItem('unitymind_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      localStorage.setItem('unitymind_token', response.token);
      localStorage.setItem('unitymind_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      toast.success('Welcome back!');
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      localStorage.setItem('unitymind_token', response.token);
      localStorage.setItem('unitymind_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      toast.success('Account created successfully!');
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
