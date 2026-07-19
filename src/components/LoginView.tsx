import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface LoginViewProps {
  onLogin: (user: string, pass: string) => Promise<boolean>;
}


export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const { t } = useTranslation('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await onLogin(username, password);
      if (!success) {
        setError(t('login.invalidCredentials'));
      }
    } catch {
      setError(t('login.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-view fixed inset-0 z-[100] flex items-center justify-center bg-[#0E0C0A] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-[#F7F3EC] tracking-tight mb-2">
            Armario<span className="text-[#C76B3F]">.</span>
          </h1>
          <p className="font-mono text-xs text-[#A89B8C] tracking-wider uppercase">
            {t('login.title')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block font-mono text-xs text-[#A89B8C] tracking-wider uppercase mb-2">
              {t('login.username')}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#161210] border border-[#2A2622] text-[#F7F3EC] px-4 py-3 rounded-lg font-sans text-sm outline-none transition-all placeholder:text-[#A89B8C]/50 focus:border-[#C76B3F] focus:ring-1 focus:ring-[#C76B3F]/40"
              placeholder={t('login.usernamePlaceholder')}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-mono text-xs text-[#A89B8C] tracking-wider uppercase mb-2">
              {t('login.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#161210] border border-[#2A2622] text-[#F7F3EC] px-4 py-3 rounded-lg font-sans text-sm outline-none transition-all placeholder:text-[#A89B8C]/50 focus:border-[#C76B3F] focus:ring-1 focus:ring-[#C76B3F]/40"
              placeholder={t('login.passwordPlaceholder')}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="toast bg-[#E0795A]/10 border border-[#E0795A]/30 text-[#E0795A] px-4 py-3 rounded-lg text-sm font-mono">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C76B3F] text-[#0B0A08] font-sans text-sm py-3.5 px-4 rounded-lg font-semibold shadow-md hover:bg-[#b36138] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-[#0B0A08]/30 border-t-[#0B0A08] rounded-full animate-spin" />
            ) : (
              t('login.submit')
            )}
          </button>
        </form>

        <p className="text-center mt-6 font-mono text-xs text-[#A89B8C]/60 tracking-wider">
          {t('login.environment')}
        </p>
        <p className="text-center mt-8 font-mono text-[11px] text-[#A89B8C]/40">
          {t('login.tagline')}
        </p>
      </div>
    </main>
  );
};
