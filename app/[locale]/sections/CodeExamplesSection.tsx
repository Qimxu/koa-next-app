'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CodeExamplesSection() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState(0);

  const codeExamples = [
    {
      title: t('home.codeExamples.nativeSQL'),
      code: `// Query using connection pool
const [user] = await db.query<UserRow[]>(
  'SELECT id, name, email FROM users WHERE id = ?',
  [userId]
);

// Transaction support
await db.transaction(async (conn) => {
  await conn.execute('INSERT INTO logs ...', [data]);
});`,
    },
    {
      title: t('home.codeExamples.jwtMiddleware'),
      code: `// Koa authentication middleware
export const authMiddleware = async (ctx, next) => {
  const token = ctx.headers.authorization?.slice(7);
  const isBlacklisted = await redis.isTokenBlacklisted(token);

  if (isBlacklisted) {
    throw new UnauthorizedException('Token revoked');
  }

  ctx.state.user = verifyAccessToken(token);
  await next();
};`,
    },
    {
      title: t('home.codeExamples.apiResponse'),
      code: `// Unified API response structure
{
  "code": 200,
  "data": { "user": {...} },
  "message": "success",
  "timestamp": "2024-01-15T08:30:00.000Z",
  "path": "/users/profile"
}`,
    },
  ];

  return (
    <section className="relative z-10 py-24 px-6 bg-white/[0.01]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Orbitron'] text-white">
            <span className="text-[#0ea5e9]">&lt;</span>
            {t('home.codeExamples.title')}
            <span className="text-[#0ea5e9]">/&gt;</span>
          </h2>
          <p className="text-[#737373] text-lg">{t('home.codeExamples.subtitle')}</p>
        </div>

        <div className="card-cyber rounded-2xl overflow-hidden">
          <div className="flex border-b border-white/10">
            {codeExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                  activeTab === index
                    ? 'text-[#0ea5e9] bg-[#0ea5e9]/5 border-b-2 border-[#0ea5e9]'
                    : 'text-[#737373] hover:text-[#a3a3a3]'
                }`}
              >
                {example.title}
              </button>
            ))}
          </div>
          <div className="p-6 bg-[#050505]">
            <pre className="text-sm text-[#a3a3a3] font-mono leading-relaxed overflow-x-auto">
              <code>{codeExamples[activeTab].code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
