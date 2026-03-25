import Router from 'koa-router';
import { Context } from 'koa';
import { db } from '../../core/utils/database';
import { redis } from '../../core/utils/redis';
// 创建路由
const router = new Router({ prefix: '/health' });

/**
 * 健康检查
 * GET /health
 */
router.get('/', async (ctx: Context) => {
  const checks = {
    database: false,
    redis: false,
  };

  try {
    await db.knex.raw('SELECT 1');
    checks.database = true;
  } catch {
    checks.database = false;
  }

  try {
    await redis.getClient().ping();
    checks.redis = true;
  } catch {
    checks.redis = false;
  }

  const isHealthy = checks.database && checks.redis;

  ctx.status = isHealthy ? 200 : 503;
  ctx.success(
    {
      status: isHealthy ? 'healthy' : 'unhealthy',
      checks,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    isHealthy ? 'Service is healthy' : 'Service is unhealthy',
  );
});

/**
 * 存活检查
 * GET /health/live
 */
router.get('/live', async (ctx: Context) => {
  ctx.success({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

/**
 * 就绪检查
 * GET /health/ready
 */
router.get('/ready', async (ctx: Context) => {
  const checks = {
    database: false,
    redis: false,
  };

  try {
    await db.knex.raw('SELECT 1');
    checks.database = true;
  } catch {
    checks.database = false;
  }

  try {
    await redis.getClient().ping();
    checks.redis = true;
  } catch {
    checks.redis = false;
  }

  const isReady = checks.database && checks.redis;

  ctx.status = isReady ? 200 : 503;
  ctx.success({
    status: isReady ? 'ready' : 'not ready',
    checks,
    timestamp: new Date().toISOString(),
  });
});

export { router as healthRouter };
