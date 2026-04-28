'use client';

import { fetchCurrentUser, logout as clearSession } from '@/app/lib/api/auth-api';
import { getAccessToken } from '@/app/lib/auth-storage';
import { AuthUser } from '@/app/types/auth';
import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_ROUTES = ['/login', '/register'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  async function refreshUser() {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      return;
    }

    const currentUser = await fetchCurrentUser();
    setUser(currentUser);
  }

  function logout() {
    clearSession();
    setUser(null);
    router.push('/login');
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        await refreshUser();
      } catch {
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!user && !isPublicRoute) {
      router.push('/login');
      return;
    }

    if (user && isPublicRoute) {
      router.push('/projects');
    }
  }, [loading, pathname, router, user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      refreshUser,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
