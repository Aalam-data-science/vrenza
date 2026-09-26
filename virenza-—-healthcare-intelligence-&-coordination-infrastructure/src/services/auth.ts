/**
 * VIRENZA Identity & Authorization Service
 * Explicit permission-based RBAC with organization context.
 */

import { User, UserPermission, UserRole } from '../types';
import { DEMO_USERS } from '../data/seed';
import { store } from './store';

const SESSION_STORAGE_KEY = 'virenza_active_session_v2';

export interface AuthSession {
  user: User;
  token: string;
  loginTime: string;
  expiresAt: string;
}

class AuthService {
  private currentSession: AuthSession | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        this.currentSession = JSON.parse(stored);
        return;
      }
    } catch {
      // fallback
    }
    // Default to Eleanor Vance (PATIENT) on first load
    this.login('patient@virenza.demo', 'virenza-demo');
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getSession(): AuthSession | null {
    return this.currentSession;
  }

  public getCurrentUser(): User | null {
    return this.currentSession?.user ?? null;
  }

  public hasPermission(permission: UserPermission): boolean {
    if (!this.currentSession?.user) return false;
    const { role, permissions } = this.currentSession.user;
    if (role === 'SUPER_ADMIN') return true;
    return permissions.includes(permission);
  }

  public hasAnyPermission(requiredPermissions: UserPermission[]): boolean {
    if (!this.currentSession?.user) return false;
    const { role, permissions } = this.currentSession.user;
    if (role === 'SUPER_ADMIN') return true;
    return requiredPermissions.some((p) => permissions.includes(p));
  }

  public login(email: string, passwordAttempt: string): { success: boolean; error?: string; session?: AuthSession } {
    const users = store.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      return { success: false, error: 'Account not recognized in VIRENZA enterprise registry.' };
    }

    if (passwordAttempt !== 'virenza-demo' && passwordAttempt !== found.passwordHash) {
      return { success: false, error: 'Invalid enterprise credential.' };
    }

    const session: AuthSession = {
      user: {
        id: found.id,
        email: found.email,
        name: found.name,
        role: found.role,
        organizationId: found.organizationId,
        organizationName: found.organizationName,
        permissions: found.permissions,
        department: found.department,
        title: found.title,
        mfaEnabled: found.mfaEnabled,
        createdAt: found.createdAt,
        updatedAt: found.updatedAt,
      },
      token: 'jwt_vrz_' + Math.random().toString(36).substring(2) + '_' + Date.now(),
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    };

    this.currentSession = session;
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }

    // Record audit event
    store.addAuditLog({
      actorId: session.user.id,
      actorName: session.user.name,
      actorRole: session.user.role,
      organizationId: session.user.organizationId,
      action: 'LOGIN',
      resourceType: 'IdentitySession',
      resourceId: session.token,
      metadata: { method: 'ENTERPRISE_PASSWORD_DEMO', mfaVerified: session.user.mfaEnabled },
    });

    this.notify();
    return { success: true, session };
  }

  public switchRole(targetEmail: string) {
    return this.login(targetEmail, 'virenza-demo');
  }

  public logout() {
    if (this.currentSession) {
      store.addAuditLog({
        actorId: this.currentSession.user.id,
        actorName: this.currentSession.user.name,
        actorRole: this.currentSession.user.role,
        organizationId: this.currentSession.user.organizationId,
        action: 'LOGOUT',
        resourceType: 'IdentitySession',
        resourceId: this.currentSession.token,
      });
    }
    this.currentSession = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    this.notify();
  }
}

export const authService = new AuthService();
