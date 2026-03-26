# 贡献指南

首先，感谢你愿意为 koa-next-app 做出贡献！❤️

## 如何贡献

### 报告 Bug

如果你发现了 Bug，请通过 [GitHub Issues](https://github.com/Qimxu/koa-next-app/issues) 报告。

在提交 Bug 报告前，请：

1. 使用搜索功能确认该问题未被报告过
2. 如果是新问题，使用 Bug Report 模板创建 issue
3. 提供详细的复现步骤和环境信息

### 建议新功能

有新功能建议？我们欢迎你的想法！

1. 先搜索现有的 issues 确认没有重复
2. 使用 Feature Request 模板创建 issue
3. 清楚地描述功能的动机和使用场景

### 提交代码 (Pull Request)

#### 开发流程

1. **Fork 仓库**

   ```bash
   # 点击 GitHub 页面的 Fork 按钮
   ```

2. **克隆你的 Fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/koa-next-app.git
   cd koa-next-app
   ```

3. **创建功能分支**

   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/bug-description
   ```

4. **安装依赖**

   ```bash
   npm install
   ```

5. **进行开发**
   - 确保代码符合项目风格
   - 添加必要的测试
   - 更新相关文档

6. **提交前检查**

   ```bash
   # 代码检查
   npm run lint

   # 类型检查
   npm run typecheck

   # 运行测试
   npm run test

   # 格式化代码
   npm run format
   ```

7. **提交更改**

   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   ```

   我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：
   - `feat:` 新功能
   - `fix:` 修复 Bug
   - `docs:` 文档更新
   - `style:` 代码格式（不影响功能）
   - `refactor:` 重构
   - `test:` 测试相关
   - `chore:` 构建/工具相关

8. **推送到你的 Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

9. **创建 Pull Request**
   - 在 GitHub 上创建 PR 到 `main` 或 `dev` 分支
   - 填写 PR 模板中的信息
   - 关联相关的 issue（如果有）

#### PR 要求

- [ ] 代码通过所有测试
- [ ] 类型检查无错误
- [ ] ESLint 无警告
- [ ] 提交信息符合规范
- [ ] 更新了相关文档（如需要）
- [ ] 添加了必要的测试（如适用）

#### 代码审查

维护者会审查你的 PR，可能会有一些反馈或修改建议。请保持耐心并积极回应。

### 开发规范

#### 后端 (Koa.js)

- 使用 TypeScript，严格类型检查
- 控制器返回统一的响应格式
- 服务层处理业务逻辑
- 使用原生 SQL，参数化查询防止注入
- 错误处理使用自定义异常类

#### 前端 (Next.js)

- 使用 TypeScript
- 组件使用函数式组件 + Hooks
- 样式使用 Tailwind CSS
- 国际化使用 next-intl
- 状态管理使用 Zustand

#### 数据库

- 迁移文件放在 `migrations/` 目录
- 使用 Knex.js 编写迁移
- 表名使用复数形式（如 `users`, `orders`）
- 字段命名使用蛇形命名法（如 `created_at`）

## 项目结构

```
koa-next-app/
├── src/              # 后端源码
├── app/              # Next.js 前端页面
├── lib/              # 前端共享库
├── components/       # React 组件
├── services/         # API 服务层
├── messages/         # i18n 翻译文件
├── migrations/       # 数据库迁移
├── scripts/          # 工具脚本
└── config/           # 配置文件
```

## 获取帮助

如果你在贡献过程中遇到问题：

1. 查看 [README.md](./README.md) 和文档
2. 在 [Discussions](https://github.com/yourusername/koa-next-app/discussions) 中提问
3. 如果是代码问题，附上错误信息和复现步骤

## 行为准则

- 尊重所有参与者
- 接受建设性的批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

## 许可证

通过贡献代码，你同意你的贡献将在 [MIT 许可证](./LICENSE) 下发布。

---

再次感谢你的贡献！🎉
�重所有参与者

- 接受建设性的批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

## 许可证

通过贡献代码，你同意你的贡献将在 [MIT 许可证](./LICENSE) 下发布。

---

再次感谢你的贡献！🎉
