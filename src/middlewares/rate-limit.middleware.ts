import { Context, Next } from 'koa';
import { config } from '../core/config';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const requests = new Map<string, RateLimitRecord>();

/**
 * 限流中间件
 * 基于内存的简单滑动窗口限流
 * @param windowMs 时间窗口（毫秒），默认从配置读取
 * @param maxRequests 最大请求数，默认从配置读取
 */
export const rateLimitMiddleware = (
  windowMs: number = config.security.rateLimitWindowMs,
  maxRequests: number = config.security.rateLimitMax,
) => {
  return async (ctx: Context, next: Next) => {
    const key = ctx.ip;
    const now = Date.now();
    const record = requests.get(key);

    if (!record || now > record.resetTime) {
      requests.set(key, { count: 1, resetTime: now + windowMs });
    } else {
      record.count++;
      if (record.count > maxRequests) {
        ctx.status = 429;
        ctx.body = {
          code: 429,
          message: 'Too many requests, please try again later',
          errors: null,
          timestamp: new Date().toISOString(),
          path: ctx.url,
        };
        return;
      }
    }

    await next();
  };
};
