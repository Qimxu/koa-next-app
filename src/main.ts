import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import mount from 'koa-mount';
import path from 'path';
import { config } from './core/config';
import { logger } from './core/utils/logger';
import { db } from './core/utils/database';
import { redis } from './core/utils/redis';

// 中间件
import { errorMiddleware } from './middlewares/error.middleware';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import { securityMiddleware, corsMiddleware } from './middlewares/security.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { rateLimitMiddleware } from './middlewares/rate-limit.middleware';
import { responseMiddleware } from './middlewares/response.middleware';

// 路由和 Next.js
import { setupRoutes } from './core/router';
import { initNextApp, nextMiddleware } from './middlewares/next.middleware';

async function bootstrap() {
  try {
    await db.initialize();
    redis.connect();
    await initNextApp();

    const app = new Koa();

    // 错误处理 (最外层)
    app.use(errorMiddleware);

    // 请求追踪
    app.use(requestIdMiddleware);

    // 安全中间件
    app.use(securityMiddleware());
    app.use(corsMiddleware);

    // 请求日志
    app.use(loggerMiddleware);

    // 静态文件服务
    app.use(mount('/static', serve(path.join(__dirname, '../static'))));

    // 限流保护
    app.use(rateLimitMiddleware(config.security.rateLimitWindowMs, config.security.rateLimitMax));

    // 请求体解析
    app.use(bodyParser());

    // 响应格式化
    app.use(responseMiddleware);

    // 注册 API 路由 (新模块化路由系统，自动加载)
    const apiRouter = await setupRoutes();
    app.use(apiRouter.routes());
    app.use(apiRouter.allowedMethods());

    // Next.js 处理页面路由（放在 API 路由之后）
    app.use(nextMiddleware);

    if (config.app.isProd) {
      app.use(serve(path.join(__dirname, '../.next/static')));
    }

    // 优雅关闭
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      db.close();
      redis.disconnect();
      process.exit(0);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    app.listen(config.app.port, () => {
      logger.info(`📚 API available at http://localhost:${config.app.port}`);
      logger.info(`📖 API Docs at http://localhost:${config.app.port}/docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
