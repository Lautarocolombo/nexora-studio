import { createContext } from 'react';

export type UserRole = 'admin' | 'curator';

export interface AuthContextValue {
  isAuthenticated: boolean;
  user?: string;
  role?: UserRole;
  login: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
