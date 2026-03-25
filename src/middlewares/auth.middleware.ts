import { Context, Next } from 'koa';
import { verifyAccessToken } from '../core/utils/jwt';
import { UnauthorizedException, ForbiddenException } from '../core/exceptions/http.exception';
import { redis } from '../core/utils/redis';
import { logger } from '../core/utils/logger';

/**
 * 认证中间件 - 强制要求有效 JWT Token
 *
 * 使用方式：
 * - 在需要认证的路由上显式引入：router.use(authMiddleware)
 * - 或在特定路由上使用：router.get('/path', authMiddleware, handler)
 *
 * 公开路由（如登录、注册）不需要引入此中间件
 */
export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('Access token required');
  }

  const token = authHeader.substring(7);

  try {
    const isBlacklisted = await redis.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }

    const payload = await verifyAccessToken(token);

    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    ctx.state.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    ctx.state.token = token;

    await next();
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new UnauthorizedException('Invalid or expired token');
  }
};

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

export const optionalAuthMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return await next();
  }

  const token = authHeader.substring(7);

  try {
    const isBlacklisted = await redis.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return await next();
    }

    const payload = await verifyAccessToken(token);

    if (payload.type === 'access') {
      ctx.state.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      ctx.state.token = token;
    }
  } catch (error) {
    logger.debug('Optional auth failed:', error);
  }

  await next();
};
