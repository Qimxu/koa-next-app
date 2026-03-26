'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@/services/users';

const techStack = [
  { name: 'Koa.js', color: '#fafafa', tag: 'Backend' },
  { name: 'Next.js 16', color: '#0ea5e9', tag: 'Frontend' },
  { name: 'TypeScript', color: '#38bdf8', tag: 'Language' },
  { name: 'MySQL', color: '#4479A1', tag: 'Database' },
  { name: 'Redis', color: '#DC382D', tag: 'Cache' },
  { name: 'Tailwind', color: '#0ea5e9', tag: 'Styling' },
  { name: 'MySQL2', color: '#f59e0b', tag: 'Driver' },
  { name: 'Zod', color: '#10B981', tag: 'Validation' },
];

interface HeroSectionProps {
  user: User | null;
}

export default function HeroSection({ user }: HeroSectionProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const isAuthenticated = !!user;

  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-16">
      <div
        className={`text-center max-w-5xl mx-auto transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Title - Koa White + Next Blue */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight font-['Orbitron'] animate-fade-in-up">
          <span className="text-white">Koa</span>
          <span className="text-[#525252]"> + </span>
          <span className="text-[#0ea5e9]">Next.js</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-[#a3a3a3] mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-100">
          {t('home.description')}
        </p>

        {/* CTA Buttons - 根据登录状态显示不同内容 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
          {isAuthenticated ? (
            <>
              {/* 已登录：显示欢迎信息和进入 Dashboard 按钮 */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] flex items-center justify-center text-white font-bold text-lg">
                    {user.name?.charAt(0).toUpperCase() ||
                      user.email?.charAt(0).toUpperCase() ||
                      'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">
                      {t('home.welcome')}, {user.name || user.email}
                    </p>
                    <p className="text-sm text-[#525252]">{user.email}</p>
                  </div>
                </div>
                <Link href={`/${locale}/dashboard`} className="btn-cyber">
                  {t('home.cta.enterDashboard')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* 未登录：显示登录/注册按钮 */}
              <Link href={`/${locale}/login`} className="btn-cyber">
                {t('home.cta.tryNow')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <a href="#features" className="btn-cyber-outline">
                {t('home.cta.learnMore')}
              </a>
            </>
          )}
        </div>

        {/* Tech Stack */}
        <div className="mt-16 pt-8 border-t border-white/5 animate-fade-in-up delay-300">
          <p className="font-['Orbitron'] text-xs tracking-widest text-[#525252] mb-4 uppercase">
            {t('home.techStack')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {techStack.map(tech => (
              <div
                key={tech.name}
                className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] hover:border-[#0ea5e9]/40 hover:bg-[#0ea5e9]/5 transition-all duration-300 rounded-xl group"
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tech.color }} />
                <span className="text-sm font-medium text-[#a3a3a3] group-hover:text-white transition-colors">
                  {tech.name}
                </span>
                <span className="text-xs text-[#525252] font-['Orbitron']">{tech.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
