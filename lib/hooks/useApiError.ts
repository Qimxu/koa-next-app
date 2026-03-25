'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

/**
 * API 错误类
 * 用于封装 API 错误信息和错误码
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * useApiError - API 错误处理 Hook
 * 封装 API 错误的翻译逻辑，将错误码转换为本地化错误信息
 */
export function useApiError() {
  const t = useTranslations();

  /**
   * 将 API 错误转换为本地化错误消息
   * @param error - 错误对象
   * @param fallbackKey - 默认错误翻译键
   * @returns 本地化的错误消息
   */
  const getErrorMessage = useCallback(
    (error: unknown, fallbackKey: string = 'errors.generic'): string => {
      if (error instanceof ApiError && error.data) {
        const errorCode = error.data as string;
        const translatedError = t(`errors.${errorCode}`);
        // 如果翻译结果与错误码相同，说明没有对应的翻译
        if (translatedError && translatedError !== errorCode) {
          return translatedError;
        }
        return error.message || t(fallbackKey);
      }

      if (error instanceof Error) {
        return error.message || t(fallbackKey);
      }

      return t(fallbackKey);
    },
    [t],
  );

  /**
   * 处理 API 错误并返回状态对象
   * 适用于表单提交场景
   */
  const handleApiError = useCallback(
    (
      error: unknown,
      options?: {
        fallbackKey?: string;
        onError?: (message: string) => void;
      },
    ): { message: string; isHandled: boolean } => {
      const message = getErrorMessage(error, options?.fallbackKey);
      options?.onError?.(message);
      return { message, isHandled: true };
    },
    [getErrorMessage],
  );

  return {
    /** 获取本地化的错误消息 */
    getErrorMessage,
    /** 处理 API 错误 */
    handleApiError,
  };
}
