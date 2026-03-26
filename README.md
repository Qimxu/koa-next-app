# Koa Next App

[![CI](https://github.com/yourusername/koa-next-app/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/koa-next-app/actions/workflows/ci.yml)
[![PR Checks](https://github.com/yourusername/koa-next-app/actions/workflows/pr.yml/badge.svg)](https://github.com/yourusername/koa-next-app/actions/workflows/pr.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

一个基于 **Koa.js** 后端和 **Next.js** 前端的全栈应用模板，使用原生 SQL 操作数据库。

> 本项目由 [koa-next-app](https://github.com/Qimxu/koa-next-app) 重构而来，将后端从 NestJS 替换为 Koa.js，数据库操作从 TypeORM 替换为原生 MySQL2。

## 技术栈

### 后端 (Koa.js)

- **Koa 2** - 轻量级 Node.js Web 框架
- **MySQL2** - 原生 SQL 数据库驱动（无 ORM）
- **ioredis** - Redis 客户端
- **JWT** - jsonwebtoken 认证
- **bcrypt** - 密码加密
- **Zod** - 数据验证
- **Winston** - 日志记录

### 前端 (Next.js)

- **Next.js 16** - React 框架，内置 Turbopack
  - ⚡ **Turbopack** - 开发服务器启动速度提升 10 倍
  - 🔥 **极速 HMR** - 热更新几乎即时响应
  - 📦 **优化构建** - 更快的生产构建
- **TypeScript** - 类型安全
- **Tailwind CSS** - 原子化 CSS
- **next-intl** - 国际化 (i18n)
- **Zustand** - 状态管理

## 为什么选择 KoaNext？

```
koa-next-app/
├── src/                          # 后端源码
│   ├── core/                     # 核心功能
│   │   ├── config/               # 配置管理
│   │   ├── exceptions/           # 异常类
│   │   └── utils/                # 工具函数
│   │       ├── database.ts       # MySQL 连接池
│   │       ├── redis.ts          # Redis 客户端
│   │       ├── jwt.ts            # JWT 工具
│   │       ├── logger.ts         # 日志
│   │       └── helpers.ts        # 辅助函数
│   ├── middlewares/              # Koa 中间件
│   │   ├── index.ts              # 通用中间件
│   │   ├── auth.middleware.ts    # 认证中间件
│   │   └── security.middleware.ts # 安全中间件
│   ├── modules/                  # 业务模块
│   │   ├── auth/                 # 认证模块
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.service.ts
│   │   ├── users/                # 用户模块
│   │   │   ├── users.controller.ts
│   │   │   └── users.service.ts
│   │   └── health/               # 健康检查
│   ├── routes/                   # 路由配置
│   └── main.ts                   # 入口文件
├── app/                          # Next.js 前端
├── lib/                          # 前端共享库
├── services/                     # API 服务层
├── messages/                     # i18n 翻译文件
├── scripts/                      # 脚本
│   ├── migrate.ts                # 数据库迁移
│   └── seed.ts                   # 数据种子
└── config/                       # YAML 配置文件
```

## 快速开始

### 1. 环境要求

- Node.js 18+
- MySQL 8.0+
- Redis 6.0+

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 应用配置
NODE_ENV=development
PORT=3001

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=koa_next_app

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT 配置
JWT_SECRET=your-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-jwt-refresh-secret-min-32

# 初始管理员账号
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Admin@123456
SEED_ADMIN_NAME=Administrator
```

### 4. 数据库迁移

```bash
npm run db:migrate
```

### 5. 数据种子

```bash
npm run db:seed
```

### 6. 启动开发服务器

```bash
# 同时启动前后端
npm run dev

# 后端运行在 http://localhost:3001
# 前端运行在 http://localhost:3001
```

## 数据库设计

### users 表

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### password_resets 表

```sql
CREATE TABLE password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API 文档

### 认证接口

| 方法 | 路径                       | 描述         |
| ---- | -------------------------- | ------------ |
| POST | `/auth/login`              | 用户登录     |
| POST | `/auth/register`           | 用户注册     |
| POST | `/auth/refresh`            | 刷新 Token   |
| POST | `/auth/logout`             | 用户登出     |
| POST | `/auth/forgot-password`    | 忘记密码     |
| POST | `/auth/verify-reset-token` | 验证重置令牌 |
| POST | `/auth/reset-password`     | 重置密码     |

### 用户接口

| 方法   | 路径             | 描述             | 权限   |
| ------ | ---------------- | ---------------- | ------ |
| GET    | `/users`         | 获取用户列表     | admin  |
| GET    | `/users/profile` | 获取当前用户信息 | 已登录 |
| GET    | `/users/:id`     | 获取指定用户     | admin  |
| POST   | `/users`         | 创建用户         | admin  |
| PATCH  | `/users/:id`     | 更新用户         | admin  |
| DELETE | `/users/:id`     | 删除用户         | admin  |

### 健康检查

| 方法 | 路径           | 描述         |
| ---- | -------------- | ------------ |
| GET  | `/health`      | 服务健康检查 |
| GET  | `/health/live` | 存活检查     |

## 与 NestJS 版本的差异

| 特性       | NestJS 版本        | Koa 版本            |
| ---------- | ------------------ | ------------------- |
| 框架       | NestJS + TypeORM   | Koa + 原生 SQL      |
| 数据库操作 | TypeORM Repository | MySQL2 连接池 + SQL |
| 依赖注入   | 内置 IoC 容器      | 手动导入模块        |
| 装饰器     | 大量使用           | 仅用于工具函数      |
| 架构复杂度 | 高（模块化）       | 低（扁平化）        |
| 性能       | 中等               | 更高（无 ORM 开销） |

## 数据库操作示例

### 查询

```typescript
// 查询单个用户
const [user] = await db.query<UserRow[]>('SELECT id, name, email FROM users WHERE id = ?', [id]);

// 查询列表（分页）
const users = await db.query<UserRow[]>('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset]);
```

### 事务

```typescript
await db.transaction(async connection => {
  await connection.execute('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
  await connection.execute('INSERT INTO logs (action) VALUES (?)', ['create_user']);
});
```

## 命令

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 生产模式
npm start

# 数据库迁移
npm run db:migrate

# 数据种子
npm run db:seed

# 类型检查
npm run typecheck

# 代码检查
npm run lint
```

## Docker 部署

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3001:3001'
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis

  mysql:
    image: mysql:8.4
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: koa_next_app
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

## 项目链接

- [📖 文档](https://github.com/Qimxu/koa-next-app#readme)
- [🐛 问题报告](https://github.com/Qimxu/koa-next-app/issues)
- [💡 功能建议](https://github.com/Qimxu/koa-next-app/issues)
- [🤝 贡献指南](./CONTRIBUTING.md)
- [🔒 安全政策](./SECURITY.md)
- [📜 更新日志](./CHANGELOG.md)

## 贡献

我们欢迎各种形式的贡献！请参阅 [贡献指南](./CONTRIBUTING.md) 了解如何参与项目。

## 许可证

MIT License
