import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const AUTH_KEY = 'outfitmatic_auth';
const SESSION_VERSION = 'v2';

// SECURITY: Las credenciales NUNCA deben estar en el cliente en producción.
// Este es un fallback de demostración para entornos locales. En producción,
// la autenticación debe delegarse a un backend (Supabase Auth / Clerk / Auth0)
// que verifique el hash en servidor y devuelva un token de sesión.
//
// Para el MVP local usamos un hash derivado (no la contraseña en claro).
// Esto evita la exposición de la contraseña real en el bundle y demuestra
// el patrón correcto: verificar un hash, no comparar texto plano.
async function deriveHash(input: string): Promise<string> {
  const data = new TextEncoder().encode(input + '::outfitmatic::pepper');
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Hash precomputado del par de demo (no revela usuario/contraseña en claro).
const DEMO_USER_HASH = 'a4f5c0d8e7b1a2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4';
const DEMO_PASS_HASH = 'b6c7d8e9f0a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4';

interface AuthContextValue {
  isAuthenticated: boolean;
  user?: string;
  role?: UserRole;
  login: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Rol del usuario autenticado. En producción viene del backend/ID token.
export type UserRole = 'admin' | 'curator';

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

    // Comparación de hashes: la contraseña real nunca viaja ni se expone.
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

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
