import { Context, Next } from 'koa';
import { logger } from '../core/utils/logger';

/**
 * 请求日志中间件
 * 记录请求开始和响应完成日志
 */
export const loggerMiddleware = async (ctx: Context, next: Next) => {
  const start = Date.now();
  const requestId = ctx.state.requestId;

  logger.info(`[${requestId}] --> ${ctx.method} ${ctx.url} - ${ctx.ip}`);

  await next();

  const ms = Date.now() - start;
  const status = ctx.status;
  const logLevel = status >= 400 ? 'warn' : 'info';

  logger[logLevel](`[${requestId}] <-- ${ctx.method} ${ctx.url} ${status} - ${ms}ms`);
};
