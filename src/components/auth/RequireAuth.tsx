'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type RequireAuthProps = {
  children: ReactNode;
  requiredRole?: string;
};

const getNextPath = () => {
  if (typeof window === 'undefined') return '';
  const { pathname, search, hash } = window.location;
  return `${pathname}${search}${hash}`;
};

const normalizeRole = (value: string | undefined) => value?.trim().toLowerCase() ?? '';

export function RequireAuth({ children, requiredRole }: RequireAuthProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('turnera_access_token');
    if (!token) {
      setAllowed(false);
      const nextPath = getNextPath();
      const loginUrl = nextPath
        ? `/?auth=login&next=${encodeURIComponent(nextPath)}`
        : '/?auth=login';
      router.replace(loginUrl);
      return;
    }

    if (requiredRole) {
      const stored = localStorage.getItem('turnera_user');
      if (!stored) {
        setAllowed(false);
        router.replace('/dashboard');
        return;
      }
      try {
        const parsed = JSON.parse(stored) as { role?: string };
        if (normalizeRole(parsed?.role) !== normalizeRole(requiredRole)) {
          setAllowed(false);
          router.replace('/dashboard');
          return;
        }
      } catch {
        setAllowed(false);
        router.replace('/dashboard');
        return;
      }
    }

    setAllowed(true);
  }, [router, requiredRole]);

  if (!allowed) return null;

  return <>{children}</>;
}
