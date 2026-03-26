import Router from 'koa-router';
import { Context } from 'koa';
import * as authService from './auth.service';
import { UnauthorizedException } from '../../core/exceptions/http.exception';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validation.middleware';
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
 */
router.post('/logout', authMiddleware, async (ctx: Context) => {
  const user = ctx.state.user;
  const token = ctx.state.token;

  if (!user || !token) {
    throw new UnauthorizedException('Authentication required');
  }

  await authService.logout(user.id, token);
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
