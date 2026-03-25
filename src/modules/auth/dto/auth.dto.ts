import { z } from 'zod';

/**
 * 登录请求 DTO
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof loginSchema>;

/**
 * 注册请求 DTO
 */
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export type RegisterDto = z.infer<typeof registerSchema>;

/**
 * 刷新 Token DTO - refreshToken 可选（支持 cookie 或 body 传递）
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

/**
 * 忘记密码 DTO
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

/**
 * 验证重置令牌 DTO
 */
export const verifyResetTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export type VerifyResetTokenDto = z.infer<typeof verifyResetTokenSchema>;

/**
 * 重置密码 DTO
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
