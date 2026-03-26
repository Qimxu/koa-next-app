'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function FooterSection() {
  const t = useTranslations();

  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-gradient-to-b from-transparent to-[#050505]/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-[#0ea5e9]/10 border border-white/20 flex items-center justify-center">
                <Image
                  src="/static/logo.png"
                  alt="KoaNext"
                  width={24}
                  height={24}
                  className="transition-all duration-300"
                />
              </div>
              <span className="font-['Orbitron'] text-lg font-bold">
                <span className="text-white">Koa</span>
                <span className="text-[#0ea5e9]">Next</span>
              </span>
            </div>
            <p className="text-sm text-[#525252] leading-relaxed mb-6">
              {t('home.footer.tagline')}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/your/koa-next-app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#525252] hover:text-[#0ea5e9] hover:border-[#0ea5e9]/30 hover:bg-[#0ea5e9]/5 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-['Orbitron'] text-sm font-semibold text-white mb-4 tracking-wider">
              {t('home.footer.product')}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-sm text-[#525252] hover:text-[#0ea5e9] transition-colors"
                >
                  {t('home.footer.links.features')}
                </a>
              </li>
              <li>
                <a
                  href="#core-features"
                  className="text-sm text-[#525252] hover:text-[#0ea5e9] transition-colors"
                >
                  {t('home.footer.links.coreFeatures')}
                </a>
              </li>
              <li>
                <a
                  href="#architecture"
                  className="text-sm text-[#525252] hover:text-[#0ea5e9] transition-colors"
                >
                  {t('home.footer.links.architecture')}
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-['Orbitron'] text-sm font-semibold text-white mb-4 tracking-wider">
              {t('home.footer.resources')}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://koajs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#525252] hover:text-white transition-colors"
                >
                  {t('home.footer.links.koa')}
                </a>
              </li>
              <li>
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#525252] hover:text-[#0ea5e9] transition-colors"
                >
                  {t('home.footer.links.nextjs')}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sidorares/node-mysql2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#525252] hover:text-[#0ea5e9] transition-colors"
                >
                  {t('home.footer.links.mysql2')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-['Orbitron'] text-sm font-semibold text-white mb-4 tracking-wider">
              {t('home.footer.contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[#525252]">
                <svg
                  className="w-4 h-4 text-[#0ea5e9]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <a href="mailto:your@email.com" className="hover:text-[#0ea5e9] transition-colors">
                  your@email.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#404040]">
              {t('home.footer.copyright', { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
