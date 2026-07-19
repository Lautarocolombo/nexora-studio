import React from 'react';
import { useAuth } from '../lib/auth';
import { LoginView } from './LoginView';
import { useLanguage } from '../hooks/useLanguage';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, login } = useAuth();
  const { language } = useLanguage();

  if (!isAuthenticated) {
    return (
      <LoginView
        onLogin={(user, pass) => login(user, pass)}
        language={language}
      />

    );
  }

  return <>{children}</>;
};

