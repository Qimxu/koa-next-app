import Router from 'koa-router';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

const BASE_URL = '';

/**
 * 自动加载所有模块路由
 * 扫描 src/modules 目录，加载所有 *.controller.ts 文件
 */
export async function setupRoutes(): Promise<Router> {
  const router = new Router({ prefix: BASE_URL });

  const modulesDir = path.join(__dirname, '../../modules');
  const routers = await loadModuleRouters(modulesDir);

  // 注册所有路由
  for (const moduleRouter of routers) {
    router.use(moduleRouter.routes(), moduleRouter.allowedMethods());
  }

  // 打印路由信息
  printRoutes(router);

  return router;
}

/**
 * 扫描模块目录，加载所有 controller
 */
async function loadModuleRouters(modulesDir: string): Promise<Router[]> {
  const routers: Router[] = [];

  // 读取 modules 目录下的所有子目录
  const entries = fs.readdirSync(modulesDir, { withFileTypes: true });
  const moduleDirs = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);

  for (const moduleName of moduleDirs) {
    const controllerPath = path.join(modulesDir, moduleName, `${moduleName}.controller.ts`);

    // 检查 controller 文件是否存在
    if (!fs.existsSync(controllerPath)) {
      continue;
    }

    try {
      // 动态导入 controller
      const controllerModule = await import(controllerPath);

      // 查找以 'Router' 结尾的导出
      const routerExport = Object.keys(controllerModule).find(key => key.endsWith('Router'));

      if (routerExport && controllerModule[routerExport] instanceof Router) {
        routers.push(controllerModule[routerExport]);
        logger.info(`  ✓ Loaded: ${moduleName}`);
      }
    } catch (error) {
      logger.error(`  ✗ Failed to load ${moduleName}:`, error);
    }
  }

  return routers;
}

/**
 * 打印所有路由
 */
function printRoutes(router: Router): void {
  logger.info(`🚀 API Routes built at: ${BASE_URL}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stack = (router as any).stack || [];
  const routes: string[] = [];

  for (const layer of stack) {
    if (layer.methods && layer.path) {
      const methods = layer.methods
        .filter((m: string) => m !== 'HEAD')
        .map((m: string) => m.padEnd(6))
        .join(' ');
      routes.push(`  ${methods} ${layer.path}`);
    }
  }

  if (routes.length > 0) {
    logger.info('📋 Registered Routes:');
    routes.sort().forEach(route => logger.info(route));
  }
}
