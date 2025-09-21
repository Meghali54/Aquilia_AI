import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'researcher' | 'policy_user' | 'guest';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token: string, user: User) => {
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'oceanus-auth',
    }
  )
);

export const checkRole = (requiredRole: string, userRole: string): boolean => {
  const roleHierarchy = {
    guest: 0,
    policy_user: 1,
    researcher: 2,
    admin: 3,
  };

  return roleHierarchy[userRole as keyof typeof roleHierarchy] >= 
         roleHierarchy[requiredRole as keyof typeof roleHierarchy];
};

export const getRedirectPath = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'researcher':
      return '/dashboard';
    case 'policy_user':
      return '/visualize';
    case 'guest':
      return '/explorer';
    default:
      return '/dashboard';
  }
};
