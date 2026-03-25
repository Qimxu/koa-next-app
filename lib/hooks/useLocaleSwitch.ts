'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n.config';

/**
 * useLocaleSwitch - 语言切换 Hook
 * 封装语言切换的路径处理逻辑
 */
export function useLocaleSwitch() {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * 切换语言
   * @param newLocale - 目标语言
   */
  const switchLocale = useCallback(
    (newLocale: Locale) => {
      const segments = pathname.split('/');

      // 如果路径第一个段是有效的 locale，替换它
      if (segments.length > 1 && isValidLocale(segments[1])) {
        segments[1] = newLocale;
      } else {
        // 否则在开头插入 locale
        segments.splice(1, 0, newLocale);
      }

      router.push(segments.join('/'));
    },
    [pathname, router],
  );

  /**
   * 获取当前语言下的路径
   * @param path - 不带 locale 的路径
   * @returns 完整的带 locale 的路径
   */
  const getLocalizedPath = useCallback(
    (path: string) => {
      const segments = pathname.split('/');
      const currentLocale = segments.length > 1 && isValidLocale(segments[1]) ? segments[1] : 'zh';

      // 确保 path 以 / 开头
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      return `/${currentLocale}${normalizedPath}`;
    },
    [pathname],
  );

  return {
    /** 切换语言 */
    switchLocale,
    /** 获取带语言前缀的路径 */
    getLocalizedPath,
  };
}
