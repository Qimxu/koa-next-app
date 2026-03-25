'use client';

import { useTranslations } from 'next-intl';

export default function ArchitectureSection() {
  const t = useTranslations();

  return (
    <section id="architecture" className="relative z-10 py-24 px-6 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Orbitron'] text-white">
            <span className="text-[#0ea5e9]">&lt;</span>
            {t('home.architecture.title')}
            <span className="text-[#0ea5e9]">/&gt;</span>
          </h2>
          <p className="text-[#737373] text-lg max-w-2xl mx-auto">
            {t('home.architecture.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Frontend — Next.js (Blue) */}
          <div className="card-cyber p-8 rounded-2xl border-[#0ea5e9]/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#0ea5e9]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {t('home.architecture.frontend.title')}
                </h3>
                <p className="text-[#0ea5e9] text-sm">{t('home.architecture.frontend.tech')}</p>
              </div>
            </div>
            <ul className="space-y-2 text-[#a3a3a3]">
              {['0', '1', '2'].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#0ea5e9] rounded-full" />
                  {t(`home.architecture.frontend.items.${i}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Backend — Koa.js (White) */}
          <div className="card-cyber p-8 rounded-2xl border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.75L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.75m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {t('home.architecture.backend.title')}
                </h3>
                <p className="text-white/60 text-sm">{t('home.architecture.backend.tech')}</p>
              </div>
            </div>
            <ul className="space-y-2 text-[#a3a3a3]">
              {['0', '1', '2'].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                  {t(`home.architecture.backend.items.${i}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
