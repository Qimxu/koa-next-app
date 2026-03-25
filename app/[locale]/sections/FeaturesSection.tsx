'use client';

import { useTranslations } from 'next-intl';

export default function FeaturesSection() {
  const t = useTranslations();

  const features = [
    {
      icon: t('home.features.koa.icon'),
      title: t('home.features.koa.title'),
      description: t('home.features.koa.description'),
    },
    {
      icon: t('home.features.nextjs.icon'),
      title: t('home.features.nextjs.title'),
      description: t('home.features.nextjs.description'),
    },
    {
      icon: t('home.features.database.icon'),
      title: t('home.features.database.title'),
      description: t('home.features.database.description'),
    },
    {
      icon: t('home.features.jwt.icon'),
      title: t('home.features.jwt.title'),
      description: t('home.features.jwt.description'),
    },
    {
      icon: t('home.features.i18n.icon'),
      title: t('home.features.i18n.title'),
      description: t('home.features.i18n.description'),
    },
    {
      icon: t('home.features.typescript.icon'),
      title: t('home.features.typescript.title'),
      description: t('home.features.typescript.description'),
    },
  ];

  return (
    <section id="features" className="relative z-10 py-24 px-6 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Orbitron'] text-white">
            <span className="text-white/20">&lt;</span>
            {t('home.features.title')}
            <span className="text-[#0ea5e9]">/&gt;</span>
          </h2>
          <p className="text-[#737373] text-lg max-w-2xl mx-auto">
            {t('home.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="card-cyber p-8 rounded-2xl group">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-[#38bdf8] transition-colors">
                {feature.title}
              </h3>
              <p className="text-[#737373] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
