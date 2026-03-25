# Koa 路由系统重构报告

> 重构时间：2026-03-24  
> 重构者：🐙 星仔  
> 目标：将集中式路由改为模块化路由，参考 NestJS 架构

---

## 📋 重构内容

### 1. 新增文件 (7个)

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.router.ts      # 认证模块路由 ✨新增
│   │   └── index.ts            # 模块导出 ✨新增
│   ├── users/
│   │   ├── users.router.ts     # 用户模块路由 ✨新增
│   │   └── index.ts            # 模块导出 ✨新增
│   └── health/
│       ├── health.router.ts    # 健康检查路由 ✨新增
│       └── index.ts            # 模块导出 ✨新增
└── core/
    └── router/
        └── index.ts            # 路由注册器 ✨新增
```

### 2. 修改文件 (7个)

```
src/
├── modules/
│   ├── auth/
│   │   └── auth.controller.ts    # 统一导出对象 🔧修改
│   ├── users/
│   │   └── users.controller.ts   # 统一导出对象 🔧修改
│   └── health/
│       └── health.controller.ts  # 统一导出对象 🔧修改
├── main.ts                       # 使用新路由系统 🔧修改
└── core/
    └── utils/
        └── database.ts           # 添加 query() 方法 🔧修改
```

### 3. 删除文件 (1个)

```
src/
└── routes/                       # ❌ 删除整个目录
    └── index.ts
```

---

## 🏗️ 新架构对比

### 重构前：集中式路由

```
src/routes/index.ts (40+ 行路由定义)
├── 所有模块路由集中定义
├── 中间件在路由层硬编码
└── 新增模块需要修改此文件
```

**问题：**
- ❌ 路由和 Controller 分离，维护困难
- ❌ 中间件散落在各处，难以追踪
- ❌ 新增模块需要修改中央路由文件
- ❌ 无法直观看到某个模块的所有路由

### 重构后：模块化路由

```
src/modules/auth/
├── auth.controller.ts    # 控制器方法
├── auth.service.ts       # 业务逻辑
├── auth.router.ts        # 路由定义 ✨
└── index.ts              # 统一导出 ✨
```

**优势：**
- ✅ 每个模块独立管理自己的路由
- ✅ 中间件在模块内定义，一目了然
- ✅ 新增模块只需在 router/index.ts 注册一行
- ✅ 模块可独立移动/复用

---

## 📁 新目录结构

```
koa-next-app/src/
├── 📁 core/
│   ├── 📁 router/              # 路由系统
│   │   └── index.ts            # 统一注册所有模块路由
│   ├── 📁 config/
│   ├── 📁 exceptions/
│   ├── 📁 next/
│   └── 📁 utils/
│
├── 📁 modules/                 # 业务模块
│   ├── 📁 auth/                # 认证模块
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.router.ts      # 模块路由 ✨
│   │   └── index.ts            # 统一导出 ✨
│   │
│   ├── 📁 users/               # 用户模块
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.router.ts     # 模块路由 ✨
│   │   └── index.ts            # 统一导出 ✨
│   │
│   └── 📁 health/              # 健康检查
│       ├── health.controller.ts
│       ├── health.router.ts    # 模块路由 ✨
│       └── index.ts            # 统一导出 ✨
│
├── 📁 middlewares/             # 全局中间件
│   ├── auth.middleware.ts
│   ├── security.middleware.ts
│   └── index.ts
│
└── main.ts                     # 应用入口
```

---

## 💡 关键代码对比

### 路由定义方式

#### 重构前 (src/routes/index.ts)
```typescript
import Router from 'koa-router';
import * as authController from '../modules/auth/auth.controller';
import * as usersController from '../modules/users/users.controller';
import { requireRole } from '../middlewares/auth.middleware';

const router = new Router({ prefix: '/api' });

// 所有路由混在一起
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
// ... 更多路由

router.get('/users', requireRole(['admin']), usersController.getAllUsers);
router.get('/users/:id', requireRole(['admin']), usersController.getUserById);
// ... 更多路由

export default router;
```

#### 重构后 (src/modules/auth/auth.router.ts)
```typescript
import Router from 'koa-router';
import { authController } from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = new Router({ prefix: '/auth' });

// 公开路由
router.post('/login', authController.login);
router.post('/register', authController.register);

// 需要认证的路由
router.post('/logout', authMiddleware, authController.logout);

export { router as authRouter };
export default router;
```

### 路由注册 (src/core/router/index.ts)
```typescript
import Router from 'koa-router';
import authRouter from '../../modules/auth/auth.router';
import usersRouter from '../../modules/users/users.router';
import healthRouter from '../../modules/health/health.router';

export function setupRoutes(): Router {
  const router = new Router();

  // 集中注册，但各模块自治
  router.use(authRouter.routes(), authRouter.allowedMethods());
  router.use(usersRouter.routes(), usersRouter.allowedMethods());
  router.use(healthRouter.routes(), healthRouter.allowedMethods());

  return router;
}
```

### main.ts 中使用
```typescript
import { setupRoutes } from './core/router';

// ...
const apiRouter = setupRoutes();
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());
```

---

## 🎯 新增模块流程

以添加 `posts` 模块为例：

### 1. 创建模块目录结构
```
src/modules/posts/
├── posts.controller.ts
├── posts.service.ts
├── posts.router.ts
└── index.ts
```

### 2. 定义路由 (posts.router.ts)
```typescript
import Router from 'koa-router';
import { postsController } from './posts.controller';
import { authMiddleware, requireRole } from '../../middlewares/auth.middleware';

const router = new Router({ prefix: '/posts' });

// 公开路由
router.get('/', postsController.getAll);
router.get('/:id', postsController.getById);

// 需要登录
router.post('/', authMiddleware, postsController.create);
router.put('/:id', authMiddleware, postsController.update);
router.delete('/:id', authMiddleware, requireRole(['admin']), postsController.remove);

export { router as postsRouter };
export default router;
```

### 3. 注册路由 (src/core/router/index.ts)
```typescript
import postsRouter from '../../modules/posts/posts.router';

export function setupRoutes(): Router {
  const router = new Router();
  
  // 现有路由...
  router.use(postsRouter.routes(), postsRouter.allowedMethods()); // 新增一行
  
  return router;
}
```

完成！✅ 不需要修改任何其他文件。

---

## 📊 重构统计

| 指标 | 重构前 | 重构后 | 变化 |
|------|--------|--------|------|
| 路由定义位置 | 1 个文件 | 3 个模块文件 | 分散化 |
| 新增模块改动 | 修改 routes/index.ts | 仅添加一行注册 | ⬇️ 复杂度 |
| 中间件位置 | 散落在路由文件 | 各模块自治 | ⬆️ 可维护性 |
| 代码耦合度 | 高 | 低 | ⬇️ 解耦 |
| 模块独立性 | 差 | 好 | ⬆️ 内聚 |

---

## ✅ 验证结果

```bash
$ npx tsc --noEmit --project tsconfig.server.json
# 无错误，编译通过 ✅
```

---

## 📝 总结

这次重构将 Koa 的路由系统从**集中式**改为**模块化**，优势：

1. **高内聚** — 每个模块的路由、控制器、服务在一起
2. **低耦合** — 新增模块不触碰现有代码
3. **易维护** — 路由和中间件一目了然
4. **可复用** — 整个模块可以独立迁移

现在 koa-next-app 的路由结构已经和 nest-next-app 的模块化理念对齐了！🎉

---

*重构完成 — 🐙 星仔*
