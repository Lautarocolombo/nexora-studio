import React, { useState, useCallback, ReactNode } from 'react';
import { AuthContext, UserRole } from './auth-context';

const AUTH_KEY = 'outfitmatic_auth';
const SESSION_VERSION = 'v2';

// SECURITY: Las credenciales NUNCA deben estar en el cliente en producción.
// Este es un fallback de demostración para entornos locales. En producción,
// la autenticación debe delegarse a un backend (Supabase Auth / Clerk / Auth0)
// que verifique el hash en servidor y devuelva un token de sesión.
async function deriveHash(input: string): Promise<string> {
  const data = new TextEncoder().encode(input + '::outfitmatic::pepper');
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const DEMO_USER_HASH = import.meta.env.VITE_DEMO_USER_HASH ?? '';
const DEMO_PASS_HASH = import.meta.env.VITE_DEMO_PASS_HASH ?? '';

interface SessionPayload {
  user: string;
  role: UserRole;
  version: string;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SessionPayload | null>(() => {
    try {
      const raw = sessionStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SessionPayload;
      if (parsed.version !== SESSION_VERSION) return null;
      return parsed;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (user: string, pass: string): Promise<boolean> => {
    const [userHash, passHash] = await Promise.all([
      deriveHash(user),
      deriveHash(pass),
    ]);

    const ok = userHash === DEMO_USER_HASH && passHash === DEMO_PASS_HASH;
    if (!ok) return false;

    const payload: SessionPayload = {
      user,
      role: 'admin',
      version: SESSION_VERSION,
    };
    try {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage errors
    }
    setSession(payload);
    return true;
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      // Ignore storage errors
    }
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: session !== null,
      user: session?.user,
      role: session?.role,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
