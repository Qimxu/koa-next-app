import { Context, Next } from 'koa';
import { logger } from '../core/utils/logger';
import { HttpException } from '../core/exceptions/http.exception';

/**
 * 错误处理中间件
 * 捕获并统一格式化错误响应
 */
export const errorMiddleware = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    const requestId = ctx.state.requestId;

    if (error instanceof HttpException) {
      ctx.status = error.statusCode;
      ctx.body = {
        code: error.statusCode,
        message: error.message,
        errors: error.errors || null,
        timestamp: new Date().toISOString(),
        path: ctx.url,
        requestId,
      };
      logger.warn(`[${requestId}] HTTP Error: ${error.statusCode} - ${error.message}`);
    } else {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: ctx.app.env === 'development' ? (error as Error).message : 'Internal server error',
        errors: null,
        timestamp: new Date().toISOString(),
        path: ctx.url,
        requestId,
      };
      logger.error(`[${requestId}] Unexpected Error:`, error);
    }
  }
};
