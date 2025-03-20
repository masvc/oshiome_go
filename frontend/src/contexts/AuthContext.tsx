import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { authService } from '../api/services/authService';
import { setStoredToken, removeStoredToken, getStoredToken } from '../api/client';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: getStoredToken(),
    isAuthenticated: false,
    isLoading: true,
  });

  // 初期化時に認証状態を確認
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      if (token) {
        try {
          const { data: user } = await authService.getCurrentUser();
          setState(prev => ({
            ...prev,
            user,
            isAuthenticated: true,
            isLoading: false,
          }));
        } catch (error) {
          removeStoredToken();
          setState(prev => ({
            ...prev,
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          }));
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await authService.login({ email, password });
    setStoredToken(data.token);
    setState({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await authService.register({ name, email, password });
    setStoredToken(data.token);
    setState({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = async () => {
    await authService.logout();
    removeStoredToken();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 