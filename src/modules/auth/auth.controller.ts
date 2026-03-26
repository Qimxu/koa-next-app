import Router from 'koa-router';
import { Context } from 'koa';
import * as authService from './auth.service';
import { UnauthorizedException } from '../../core/exceptions/http.exception';
import { optionalAuthMiddleware } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validation.middleware';
import { verifyRefreshToken, getTokenExpiresInSeconds } from '../../core/utils/jwt';
import { redis } from '../../core/utils/redis';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  verifyResetTokenSchema,
  resetPasswordSchema,
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  VerifyResetTokenDto,
  ResetPasswordDto,
} from './dto/auth.dto';

const router = new Router({ prefix: '/auth' });

/**
 * 用户登录
 * POST /auth/login
 */
router.post('/login', validateBody(loginSchema), async (ctx: Context) => {
  const input = ctx.state.validatedBody as LoginDto;
  const result = await authService.login(input);
  ctx.success(result);
});

/**
 * 用户注册
 * POST /auth/register
 */
router.post('/register', validateBody(registerSchema), async (ctx: Context) => {
  const input = ctx.state.validatedBody as RegisterDto;
  const result = await authService.register(input);
  ctx.status = 201;
  ctx.success(result, 'User registered successfully');
});

/**
 * 刷新 Token
 * POST /auth/refresh
 */
router.post('/refresh', validateBody(refreshTokenSchema), async (ctx: Context) => {
  const input = ctx.state.validatedBody as RefreshTokenDto;
  // 优先从 body 获取，其次从 X-Refresh-Token header 获取
  const refreshToken = input.refreshToken || (ctx.headers['x-refresh-token'] as string);

  if (!refreshToken) {
    ctx.status = 401;
    ctx.body = { error: 'Refresh token required' };
    return;
  }

  const result = await authService.refreshToken(refreshToken);
  ctx.success(result);
});

/**
 * 用户登出
 * POST /auth/logout
 *
 * 支持两种方式：
 * 1. 通过 access_token (authMiddleware)
 * 2. 通过 refresh_token cookie
 */
router.post('/logout', optionalAuthMiddleware, async (ctx: Context) => {
  let userId = ctx.state.user?.id;
  let token = ctx.state.token;

  // 如果 access_token 不存在，尝试从 refresh_token cookie 获取
  if (!userId) {
    const refreshToken = ctx.cookies.get('refresh_token');
    if (!refreshToken) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const payload = await verifyRefreshToken(refreshToken);
      if (payload.type === 'refresh') {
        userId = payload.sub;
      }
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 获取一个有效的 access token 来加入黑名单（从 cookie 或 header）
    const accessToken = ctx.cookies.get('access_token');
    if (accessToken) {
      token = accessToken;
    }
  }

  if (!userId) {
    throw new UnauthorizedException('Authentication required');
  }

  // 如果有 token，加入黑名单
  if (token) {
    const ttl = getTokenExpiresInSeconds(token) || 3600;
    await redis.setBlacklistToken(token, ttl);
  }

  // 清除该用户的所有 refresh tokens
  await redis.removeAllUserRefreshTokens(userId);

  // 清除 cookies
  ctx.cookies.set('access_token', '', {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  ctx.cookies.set('refresh_token', '', {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  ctx.success(null, 'Logged out successfully');
});

/**
 * 忘记密码
 * POST /auth/forgot-password
 */
router.post('/forgot-password', validateBody(forgotPasswordSchema), async (ctx: Context) => {
  const input = ctx.state.validatedBody as ForgotPasswordDto;
  const result = await authService.forgotPassword(input.email);
  ctx.success(result);
});

/**
 * 验证重置令牌
 * POST /auth/verify-reset-token
 */
router.post('/verify-reset-token', validateBody(verifyResetTokenSchema), async (ctx: Context) => {
  const input = ctx.state.validatedBody as VerifyResetTokenDto;
  const result = await authService.verifyResetToken(input.token);
  ctx.success({
    valid: result.valid,
    email: result.email,
    message: result.valid ? 'Token is valid' : 'Invalid or expired token',
  });
});

/**
 * 重置密码
 * POST /auth/reset-password
 */
router.post('/reset-password', validateBody(resetPasswordSchema), async (ctx: Context) => {
  const input = ctx.state.validatedBody as ResetPasswordDto;
  await authService.resetPassword(input.token, input.newPassword);
  ctx.success(null, 'Password reset successfully');
});

export { router as authRouter };
