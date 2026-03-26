import { Context, Next } from 'koa';
import { verifyAccessToken } from '../core/utils/jwt';
import { UnauthorizedException, ForbiddenException } from '../core/exceptions/http.exception';
import { redis } from '../core/utils/redis';
import { logger } from '../core/utils/logger';

/**
 * 从请求中获取 JWT Token
 * 支持两种方式：
 * 1. Authorization: Bearer <token> Header
 * 2. access_token Cookie
 */
const getTokenFromRequest = (ctx: Context): string | null => {
  // 1. 尝试从 Authorization Header 获取
  const authHeader = ctx.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // 2. 尝试从 Cookie 获取
  const cookieToken = ctx.cookies.get('access_token');
  if (cookieToken) {
    return cookieToken;
  }

  return null;
};

/**
 * 验证并解析 Token
 */
const verifyToken = async (
  token: string,
): Promise<{ id: number; email: string; role: string } | null> => {
  try {
    const isBlacklisted = await redis.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return null;
    }

    const payload = await verifyAccessToken(token);

    if (payload.type !== 'access') {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    logger.debug('Token verification failed:', error);
    return null;
  }
};

/**
 * 认证中间件 - 强制要求有效 JWT Token
 *
 * 使用方式：
 * - 在需要认证的路由上显式引入：router.use(authMiddleware)
 * - 或在特定路由上使用：router.get('/path', authMiddleware, handler)
 *
 * Token 来源（按优先级）：
 * 1. Authorization: Bearer <token> Header
 * 2. access_token Cookie
 *
 * 公开路由（如登录、注册）不需要引入此中间件
 */
export const authMiddleware = async (ctx: Context, next: Next) => {
  const token = getTokenFromRequest(ctx);

  if (!token) {
    throw new UnauthorizedException('Access token required');
  }

  const user = await verifyToken(token);

  if (!user) {
    throw new UnauthorizedException('Invalid or expired token');
  }

  ctx.state.user = user;
  ctx.state.token = token;

  await next();
};

/**
 * 角色权限中间件
 */
export const requireRole = (roles: string[]) => {
  return async (ctx: Context, next: Next) => {
    const user = ctx.state.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    await next();
  };
};

/**
 * 可选认证中间件 - 有 token 就解析，没有也不报错
 *
 * Token 来源（按优先级）：
 * 1. Authorization: Bearer <token> Header
 * 2. access_token Cookie
 */
export const optionalAuthMiddleware = async (ctx: Context, next: Next) => {
  const token = getTokenFromRequest(ctx);

  if (token) {
    const user = await verifyToken(token);
    if (user) {
      ctx.state.user = user;
      ctx.state.token = token;
    }
  }

  await next();
};
