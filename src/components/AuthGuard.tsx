import React from 'react';
import { useAuth } from '../lib/auth';
import { LoginView } from './LoginView';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return (
      <LoginView
        onLogin={(user, pass) => login(user, pass)}
      />

    );
  }

  return <>{children}</>;
};

