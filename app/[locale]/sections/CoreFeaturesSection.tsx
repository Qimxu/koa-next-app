'use client';

import { useTranslations } from 'next-intl';

export default function CoreFeaturesSection() {
  const t = useTranslations();

  const coreFeatures = [
    {
      icon: t('home.coreFeatures.lightweight.icon'),
      title: t('home.coreFeatures.lightweight.title'),
      description: t('home.coreFeatures.lightweight.description'),
      highlight: t('home.coreFeatures.lightweight.highlight'),
      problem: t('home.coreFeatures.lightweight.problem'),
      solution: t('home.coreFeatures.lightweight.solution'),
    },
    {
      icon: t('home.coreFeatures.nativeSQL.icon'),
      title: t('home.coreFeatures.nativeSQL.title'),
      description: t('home.coreFeatures.nativeSQL.description'),
      highlight: t('home.coreFeatures.nativeSQL.highlight'),
      problem: t('home.coreFeatures.nativeSQL.problem'),
      solution: t('home.coreFeatures.nativeSQL.solution'),
    },
    {
      icon: t('home.coreFeatures.auth.icon'),
      title: t('home.coreFeatures.auth.title'),
      description: t('home.coreFeatures.auth.description'),
      highlight: t('home.coreFeatures.auth.highlight'),
      problem: t('home.coreFeatures.auth.problem'),
      solution: t('home.coreFeatures.auth.solution'),
    },
    {
      icon: t('home.coreFeatures.frontend.icon'),
      title: t('home.coreFeatures.frontend.title'),
      description: t('home.coreFeatures.frontend.description'),
      highlight: t('home.coreFeatures.frontend.highlight'),
      problem: t('home.coreFeatures.frontend.problem'),
      solution: t('home.coreFeatures.frontend.solution'),
    },
  ];

  return (
    <section id="core-features" className="relative z-10 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-pulse" />
            <span className="text-sm text-[#0ea5e9] font-medium">
              {t('home.coreFeatures.badge')}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Orbitron'] text-white">
            <span className="text-white/20">&lt;</span>
            {t('home.coreFeatures.title')}
            <span className="text-[#0ea5e9]">/&gt;</span>
          </h2>
          <p className="text-[#737373] text-lg max-w-2xl mx-auto">
            {t('home.coreFeatures.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreFeatures.map((feature, index) => (
            <div
              key={index}
              className="card-cyber p-8 rounded-2xl group hover:border-[#0ea5e9]/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[#38bdf8] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[#a3a3a3] leading-relaxed mb-4">{feature.description}</p>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-[#525252] font-medium flex-shrink-0">
                        {t('home.coreFeatures.problemLabel')}:
                      </span>
                      <span className="text-[#737373]">{feature.problem}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-[#0ea5e9] font-medium flex-shrink-0">
                        {t('home.coreFeatures.solutionLabel')}:
                      </span>
                      <span className="text-[#737373]">{feature.solution}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#38bdf8]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature.highlight}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
