import { create } from 'zustand';
import { AuthState, User, LoginCredentials, RegisterCredentials } from '../types/auth';
import { authService } from '../api/services/authService';
import { setStoredToken, removeStoredToken } from '../api/client';
import { isSuccessResponse } from '../types';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (isSuccessResponse(response) && response.data) {
        setStoredToken(response.data.token);
        set({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  register: async (credentials) => {
    try {
      const response = await authService.register(credentials);
      if (isSuccessResponse(response) && response.data) {
        setStoredToken(response.data.token);
        set({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      removeStoredToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } catch (error) {
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const response = await authService.getCurrentUser();
      if (isSuccessResponse(response) && response.data) {
        set({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
})); 