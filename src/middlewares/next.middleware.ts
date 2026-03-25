import { Context, Next } from 'koa';
import next from 'next';
import { config } from '../core/config';
import { logger } from '../core/utils/logger';

// 初始化 Next.js
const dev = !config.app.isProd;
const nextApp = next({ dev, dir: './' });
const handle = nextApp.getRequestHandler();

let isNextReady = false;

export const initNextApp = async () => {
  if (!isNextReady) {
    await nextApp.prepare();
    isNextReady = true;
    logger.info('✅ Next.js app prepared');
  }
};

export const nextMiddleware = async (ctx: Context, next: Next) => {
  // 如果响应已经被处理，跳过
  if (ctx.respond === false || ctx.body !== undefined) {
    return await next();
  }

  // API 路由已经在前面的 router 中处理，这里处理页面路由
  // Next.js 会处理所有非 API 路由

  // 将 Koa 请求转换为 Next.js 可处理的格式
  ctx.respond = false;

  // 设置必要的响应头
  ctx.res.statusCode = 200;

  // 使用 Next.js 处理请求
  await handle(ctx.req, ctx.res);
};
