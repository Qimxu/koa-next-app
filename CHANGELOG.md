# Changelog

所有项目的显著变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 升级

- **Next.js 14 → Next.js 16**
  - 升级至最新稳定版 Next.js 16
  - 启用 Turbopack 开发模式，启动速度提升 10 倍
  - 改进的开发体验和更快的 HMR
  - 更好的并行路由支持
  - 优化的构建性能
- **ESLint 配置更新**
  - 配置文件迁移至 `eslint.config.mjs`
  - 支持 ES Module 规范
- **依赖更新**
  - `next`: ^14.x → ^16.2.1
  - `eslint-config-next`: ^14.x → ^16.2.1
  - `@eslint/eslintrc`: ^3.x (新版 ESLint 支持)

### 优化

- 首页 Hero 区域更新版本号标识 (Next.js 16)
- 文档同步更新技术栈版本信息

## [1.0.0] - 2024-XX-XX

### 新增

- 项目初始化
- 基础后端 API（Koa.js）
  - 用户认证模块
  - 用户管理模块
  - 健康检查端点
- 前端应用（Next.js）
  - 登录/注册页面
  - 国际化支持（next-intl）
  - Tailwind CSS 样式
- 数据库迁移和种子脚本
- 完整的开发环境配置
- GitHub Actions CI/CD

### 技术栈

- Node.js 18+
- Koa.js 2.x
- Next.js 16
- MySQL 8.0
- Redis 6.0
- TypeScript 5.x
- Tailwind CSS 3.x

---

## 版本说明

### 版本号格式

`主版本号.次版本号.修订号`

- **主版本号**：不兼容的 API 变更
- **次版本号**：向下兼容的功能新增
- **修订号**：向下兼容的问题修复

### 变更类型

- `新增`：新功能
- `变更`：现有功能的变更
- `弃用`：即将移除的功能
- `移除`：已移除的功能
- `修复`：Bug 修复
- `安全`：安全相关的修复
