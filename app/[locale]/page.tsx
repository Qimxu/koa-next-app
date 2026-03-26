import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';
import BackgroundEffects from './components/BackgroundEffects';
import HeroSection from './sections/HeroSection';
import CoreFeaturesSection from './sections/CoreFeaturesSection';
import CodeExamplesSection from './sections/CodeExamplesSection';
import UIShowcasesSection from './sections/UIShowcasesSection';
import FeaturesSection from './sections/FeaturesSection';
import ArchitectureSection from './sections/ArchitectureSection';
import QuickStartSection from './sections/QuickStartSection';
import CTASection from './sections/CTASection';
import FooterSection from './sections/FooterSection';
import type { User } from '@/services/users';

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
 * SSR 阶段获取完整用户信息（含真实 name）
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

    return user;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const user = await getServerFullUser();

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <BackgroundEffects />
      <HeroSection user={user} />
      <CoreFeaturesSection />
      <CodeExamplesSection />
      <UIShowcasesSection />
      <FeaturesSection />
      <ArchitectureSection />
      <QuickStartSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
