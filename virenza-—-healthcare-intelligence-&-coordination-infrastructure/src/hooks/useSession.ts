/**
 * VIRENZA Active Session & Authorization Hook
 */

import { useState, useEffect } from 'react';
import { authService, AuthSession } from '../services/auth';
import { User, UserPermission, UserRole } from '../types';

export function useSession() {
  const [session, setSession] = useState<AuthSession | null>(authService.getSession());

  useEffect(() => {
    const unsub = authService.subscribe(() => {
      setSession(authService.getSession());
    });
    return unsub;
  }, []);

  const user: User | null = session?.user ?? null;

  const hasPermission = (permission: UserPermission): boolean => {
    return authService.hasPermission(permission);
  };

  const hasAnyPermission = (permissions: UserPermission[]): boolean => {
    return authService.hasAnyPermission(permissions);
  };

  const isRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  return {
    session,
    user,
    role: user?.role,
    isAuthenticated: !!session,
    hasPermission,
    hasAnyPermission,
    isRole,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    switchRole: authService.switchRole.bind(authService),
  };
}
