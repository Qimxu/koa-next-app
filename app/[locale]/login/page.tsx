'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth';
import { LoginBackground } from '@/lib/components/ui/CyberBackground';
import { FormInput } from '@/lib/components/ui/FormInput';
import { useApiError } from '@/lib/hooks';

export default function LoginPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { login } = useAuth();
  const { getErrorMessage } = useApiError();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push(`/${locale}`);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'auth.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Effects */}
      <LoginBackground />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="font-['Orbitron'] text-3xl font-bold text-white mb-2">
              <span className="text-[#262626]">&lt;</span>
              {t('auth.signInTitle')}
              <span className="text-[#0ea5e9]">/&gt;</span>
            </h1>
            <p className="text-[#737373]">
              {t('auth.noAccount')}{' '}
              <Link
                href={`/${locale}/register`}
                className="text-[#7dd3fc] hover:text-[#0ea5e9] transition-colors hover:underline"
              >
                {t('auth.createAccount')}
              </Link>
            </p>
          </div>

          {/* Form Card */}
          <div className="card-cyber p-8 rounded-2xl animate-fade-in-up delay-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div className="bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-[#7dd3fc] px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <FormInput
                id="email"
                name="email"
                type="email"
                label={t('auth.email')}
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
              />

              {/* Password Field */}
              <FormInput
                id="password"
                name="password"
                type="password"
                label={t('auth.password')}
                autoComplete="current-password"
                required
                showPasswordToggle
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                labelClassName="mb-0"
                rightElement={
                  <Link
                    href={`/${locale}/forgot-password`}
                    className="text-xs text-[#525252] hover:text-[#7dd3fc] transition-colors whitespace-nowrap"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                }
              />

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="w-4 h-4 bg-[#0a0a0a] border border-white/10 rounded focus:ring-[#0ea5e9] focus:ring-1 accent-[#0ea5e9]"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-[#737373]">
                  {t('auth.rememberMe')}
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-cyber w-full justify-center"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <>
                    {t('auth.signIn')}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center animate-fade-in-up delay-200">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-sm text-[#525252] hover:text-[#7dd3fc] transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              {t('auth.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
