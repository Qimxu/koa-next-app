'use client';

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-cyber-grid opacity-40" />
      {/* Koa White orb */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      {/* Next Blue orb */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0ea5e9]/10 rounded-full blur-3xl" />
      {/* Cyan accent orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#38bdf8]/5 rounded-full blur-3xl" />
    </div>
  );
}
