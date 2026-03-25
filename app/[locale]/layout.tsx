import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';
import { locales, isValidLocale } from '@/i18n.config';
import { AuthProvider } from '@/components/auth';
import { Navbar } from '@/lib/components/layout/Navbar';
import type { User, UserRole } from '@/services/users';

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }
}

interface ServerUser {
  id: number;
  email: string;
  role: string;
  token: string;
}

/**
 * 从 Cookie 解码 JWT，返回基础用户信息 + 原始 token
 */
async function getServerUser(): Promise<ServerUser | null> {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) return null;

    const payload = decodeJwt(accessToken);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    if (!payload.sub || !payload.email) return null;

    return {
      id: parseInt(payload.sub as string, 10),
      email: payload.email as string,
      role: (payload.role as string) || 'user',
      token: accessToken,
    };
  } catch {
    return null;
  }
}

/**
 * SSR 阶段获取完整用户信息（含真实 name），避免客户端二次请求导致界面闪烁
 */
async function getServerFullUser(): Promise<User | null> {
  const serverUser = await getServerUser();
  if (!serverUser) return null;

  try {
    const apiBase =
      process.env.INTERNAL_API_URL || process.env.API_BASE_URL || 'http://localhost:3001';

    const res = await fetch(`${apiBase}/users/profile`, {
      headers: {
        Authorization: `Bearer ${serverUser.token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    } as RequestInit);

    if (!res.ok) return null;

    const json = (await res.json()) as { data?: User };
    const user = json.data;
    if (!user) return null;

    return {
      ...user,
      role: user.role as string as UserRole,
    };
  } catch {
    return null;
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  // 并行获取 messages 和完整用户信息，减少 SSR 等待时间
  const [messages, initialUser] = await Promise.all([
    getMessages(locale),
    getServerFullUser(), // 直接获取真实 name，首屏无闪烁
  ]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider initialUser={initialUser ?? null}>
        <Navbar />
        {children}
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
