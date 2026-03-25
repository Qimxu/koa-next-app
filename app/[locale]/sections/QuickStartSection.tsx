'use client';

import { useTranslations } from 'next-intl';

export default function QuickStartSection() {
  const t = useTranslations();

  const steps = [
    {
      step: t('home.quickStart.step1.step'),
      title: t('home.quickStart.step1.title'),
      desc: t('home.quickStart.step1.desc'),
      command: 'git clone https://github.com/your/koa-next-app.git',
    },
    {
      step: t('home.quickStart.step2.step'),
      title: t('home.quickStart.step2.title'),
      desc: t('home.quickStart.step2.desc'),
      command: 'cp .env.example .env && npm install',
    },
    {
      step: t('home.quickStart.step3.step'),
      title: t('home.quickStart.step3.title'),
      desc: t('home.quickStart.step3.desc'),
      command: 'docker-compose up -d && npm run db:migrate',
    },
  ];

  return (
    <section id="start" className="relative z-10 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Orbitron'] text-white">
            <span className="text-[#38bdf9]">&lt;</span>
            {t('home.quickStart.title')}
            <span className="text-[#38bdf9]">/&gt;</span>
          </h2>
          <p className="text-[#737373] text-lg">{t('home.quickStart.subtitle')}</p>
        </div>

        <div className="space-y-6">
          {steps.map((item, index) => (
            <div
              key={index}
              className="card-cyber rounded-2xl p-6 group hover:border-[#0ea5e9]/20 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="text-4xl font-bold text-white/10 font-['Orbitron'] w-16 flex-shrink-0 group-hover:text-white/20 transition-colors">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1 text-white group-hover:text-[#38bdf8] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#737373] text-sm mb-3">{item.desc}</p>
                </div>
                {item.command && (
                  <div className="md:w-auto">
                    <code className="px-4 py-2 bg-[#050505] border border-white/[0.06] rounded-lg text-sm text-[#38bdf8] font-mono">
                      {item.command}
                    </code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="https://github.com/your/koa-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyber"
          >
            {t('home.cta.getStarted')}
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
