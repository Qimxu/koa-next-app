import Router from 'koa-router';
import { Context } from 'koa';
import * as usersService from './users.service';
import { NotFoundException, ForbiddenException } from '../../core/exceptions/http.exception';
import { authMiddleware, requireRole } from '../../middlewares/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validation.middleware';
import {
  createUserSchema,
  updateUserSchema,
  paginationSchema,
  paramsIdSchema,
  CreateUserDto,
  UpdateUserDto,
  PaginationDto,
  ParamsIdDto,
} from './dto/users.dto';

const router = new Router({ prefix: '/users' });

// 所有用户路由都需要认证
router.use(authMiddleware);

/**
 * 获取当前用户资料
 * GET /users/profile
 */
router.get('/profile', async (ctx: Context) => {
  const userId = ctx.state.user?.id;

  if (!userId) {
    throw new ForbiddenException('Authentication required');
  }

  const user = await usersService.findById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  ctx.success(user);
});

// 以下路由需要 admin 角色
const requireAdmin = requireRole(['admin']);

/**
 * 获取所有用户（分页）
 * GET /users
 */
router.get(
  '/',
  requireAdmin,
  validateQuery(paginationSchema),
  async (ctx: Context) => {
    const query = ctx.state.validatedQuery as PaginationDto;
    const page = typeof query.page === 'number' ? query.page : 1;
    const limit = typeof query.limit === 'number' ? query.limit : 10;
    const result = await usersService.findAllPaginated(page, limit);
    ctx.success(result);
  }
);

/**
 * 根据 ID 获取用户
 * GET /users/:id
 */
router.get(
  '/:id',
  requireAdmin,
  validateParams(paramsIdSchema),
  async (ctx: Context) => {
    const params = ctx.state.validatedParams as ParamsIdDto;
    const id = parseInt(params.id, 10);

    const user = await usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    ctx.success(user);
  }
);

/**
 * 创建用户
 * POST /users
 */
router.post(
  '/',
  requireAdmin,
  validateBody(createUserSchema),
  async (ctx: Context) => {
    const input = ctx.state.validatedBody as CreateUserDto;
    const user = await usersService.createUser(input);
    ctx.status = 201;
    ctx.success(user, 'User created successfully');
  }
);

/**
 * 更新用户
 * PATCH /users/:id
 */
router.patch(
  '/:id',
  requireAdmin,
  validateParams(paramsIdSchema),
  validateBody(updateUserSchema),
  async (ctx: Context) => {
    const params = ctx.state.validatedParams as ParamsIdDto;
    const id = parseInt(params.id, 10);
    const input = ctx.state.validatedBody as UpdateUserDto;

    const user = await usersService.updateUser(id, input);
    ctx.success(user, 'User updated successfully');
  }
);

/**
 * 删除用户
 * DELETE /users/:id
 */
router.delete(
  '/:id',
  requireAdmin,
  validateParams(paramsIdSchema),
  async (ctx: Context) => {
    const params = ctx.state.validatedParams as ParamsIdDto;
    const id = parseInt(params.id, 10);

    const currentUser = ctx.state.user;
    if (currentUser?.id === id) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    await usersService.deleteUser(id);
    ctx.success(null, 'User deleted successfully');
  }
);

export { router as usersRouter };
