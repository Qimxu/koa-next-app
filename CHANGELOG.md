# Changelog

所有项目的显著变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 新增

- 初始项目结构搭建
- Koa.js + Next.js 全栈集成
- 用户认证系统（注册、登录、JWT）
- MySQL 数据库支持（原生 SQL）
- Redis 缓存支持
- Docker 容器化部署
- CI/CD 工作流配置

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
- Next.js 14
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
