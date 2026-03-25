'use client';

/**
 * CyberBackground - 赛博朋克风格背景组件
 * 统一处理所有页面的背景效果，避免代码重复
 */

interface CyberBackgroundProps {
  /** 是否显示网格背景 */
  showGrid?: boolean;
  /** 是否显示光晕效果 */
  showOrbs?: boolean;
  /** 网格透明度 (0-1) */
  gridOpacity?: number;
  /** 额外类名 */
  className?: string;
}

export function CyberBackground({
  showGrid = true,
  showOrbs = true,
  gridOpacity = 0.4,
  className = '',
}: CyberBackgroundProps) {
  return (
    <div className={`fixed inset-0 z-0 ${className}`}>
      {/* 基础渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0f0f0f] to-background" />

      {/* 网格背景 */}
      {showGrid && (
        <div className="absolute inset-0 bg-cyber-grid" style={{ opacity: gridOpacity }} />
      )}

      {/* 光晕效果 */}
      {showOrbs && (
        <>
          {/* Koa White orb - 左上角 */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

          {/* Next Blue orb - 右下角 */}
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-next/10 rounded-full blur-3xl" />

          {/* Cyan accent orb - 中间 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-next-cyan/5 rounded-full blur-3xl" />
        </>
      )}
    </div>
  );
}

/**
 * 简化的登录页背景（更少的光晕）
 */
export function LoginBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`fixed inset-0 z-0 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0f0f0f] to-background" />
      <div className="absolute inset-0 bg-cyber-grid opacity-40" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-border/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-next/5 rounded-full blur-3xl" />
    </div>
  );
}
