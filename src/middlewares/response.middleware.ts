import { Context, Next } from 'koa';
import { successResponse } from '../core/utils/response';

/**
 * 响应格式化中间件
 * 为ctx添加success方法，统一成功响应格式
 */
export const responseMiddleware = async (ctx: Context, next: Next) => {
  ctx.success = (data: unknown, message?: string) => {
    ctx.body = successResponse(data, message, ctx.url);
  };
  await next();
};
