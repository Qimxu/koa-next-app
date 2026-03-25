'use client';

import { useTranslations } from 'next-intl';

export default function UIShowcasesSection() {
  const t = useTranslations();

  const uiShowcases = [
    {
      title: t('home.uiShowcases.passwordToggle.title'),
      description: t('home.uiShowcases.passwordToggle.description'),
      icon: t('home.uiShowcases.passwordToggle.icon'),
    },
    {
      title: t('home.uiShowcases.formValidation.title'),
      description: t('home.uiShowcases.formValidation.description'),
      icon: t('home.uiShowcases.formValidation.icon'),
    },
    {
      title: t('home.uiShowcases.i18n.title'),
      description: t('home.uiShowcases.i18n.description'),
      icon: t('home.uiShowcases.i18n.icon'),
    },
    {
      title: t('home.uiShowcases.darkTheme.title'),
      description: t('home.uiShowcases.darkTheme.description'),
      icon: t('home.uiShowcases.darkTheme.icon'),
    },
  ];

  return (
    <section className="relative z-10 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Orbitron'] text-white">
            <span className="text-[#38bdf8]">&lt;</span>
            {t('home.uiShowcases.title')}
            <span className="text-[#38bdf8]">/&gt;</span>
          </h2>
          <p className="text-[#737373] text-lg max-w-2xl mx-auto">
            {t('home.uiShowcases.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {uiShowcases.map((showcase, index) => (
            <div
              key={index}
              className="card-cyber p-6 rounded-2xl text-center group hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {showcase.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{showcase.title}</h3>
              <p className="text-sm text-[#737373]">{showcase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
