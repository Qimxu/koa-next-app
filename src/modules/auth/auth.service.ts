import { redis } from '../../core/utils/redis';
import { db, PasswordResetRow } from '../../core/utils/database';
import { generateTokens, verifyRefreshToken, getTokenExpiresInSeconds } from '../../core/utils/jwt';
import { findByEmail, createUser, UserRole, UserResponse, findById } from '../users/users.service';
import {
  comparePassword,
  hashPassword,
  generateRandomToken,
  parseDurationToSeconds,
} from '../../core/utils/helpers';
import {
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '../../core/exceptions/http.exception';
import { config } from '../../core/config';
import { logger } from '../../core/utils/logger';

const PASSWORD_RESET_TABLE = 'password_resets';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface AuthResponse {
  user: UserResponse;
  tokens: TokenResponse;
}

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await findByEmail(input.email, true);

  if (!user || !user.password) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const isValidPassword = await comparePassword(input.password, user.password);

  if (!isValidPassword) {
    throw new UnauthorizedException('Invalid email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedException('Account is disabled');
  }

  const { password: _, ...userWithoutPassword } = user;

  const tokens = await generateTokens({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshExpiresInSeconds = parseDurationToSeconds(config.jwt.refreshExpiresIn);
  await redis.storeRefreshToken(user.id, tokens.refreshToken, refreshExpiresInSeconds);

  logger.info(`User logged in: ${user.email} (${user.id})`);

  return {
    user: userWithoutPassword,
    tokens: {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_in: 30 * 60,
    },
  };
};

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const user = await createUser({
    name: input.name,
    email: input.email,
    password: input.password,
    role: UserRole.USER,
  });

  const tokens = await generateTokens({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshExpiresInSeconds = parseDurationToSeconds(config.jwt.refreshExpiresIn);
  await redis.storeRefreshToken(user.id, tokens.refreshToken, refreshExpiresInSeconds);

  logger.info(`User registered: ${user.email} (${user.id})`);

  return {
    user,
    tokens: {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_in: 30 * 60,
    },
  };
};

export const refreshToken = async (refreshTokenStr: string): Promise<TokenResponse> => {
  try {
    const payload = await verifyRefreshToken(refreshTokenStr);

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const isValid = await redis.getRefreshToken(payload.sub, refreshTokenStr);
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or disabled');
    }

    await redis.removeRefreshToken(payload.sub, refreshTokenStr);

    const tokens = await generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshExpiresInSeconds =
      parseInt(config.jwt.refreshExpiresIn) * 24 * 60 * 60 || 7 * 24 * 60 * 60;
    await redis.storeRefreshToken(user.id, tokens.refreshToken, refreshExpiresInSeconds);

    logger.info(`Token refreshed for user: ${user.email} (${user.id})`);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_in: 30 * 60,
    };
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new UnauthorizedException('Invalid refresh token');
  }
};

export const logout = async (userId: number, accessToken: string): Promise<void> => {
  const ttl = getTokenExpiresInSeconds(accessToken);
  await redis.setBlacklistToken(accessToken, ttl);

  const refreshKeys = await redis.getClient().keys(`refresh:${userId}:*`);
  for (const key of refreshKeys) {
    const token = key.replace(`refresh:${userId}:`, '');
    await redis.removeRefreshToken(userId, token);
  }

  logger.info(`User logged out: ${userId}`);
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const user = await findByEmail(email);

  if (!user) {
    return {
      message: 'If an account exists with this email, a password reset link has been sent',
    };
  }

  const resetToken = generateRandomToken(32);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await db.knex(PASSWORD_RESET_TABLE).insert({
    user_id: user.id,
    token: resetToken,
    expires_at: expiresAt,
    used: false,
    created_at: db.knex.fn.now(),
  });

  await redis.setPasswordResetToken(resetToken, user.id, 60 * 60);

  logger.info(`Password reset requested for: ${email}`);

  return {
    message: 'If an account exists with this email, a password reset link has been sent',
  };
};

export const verifyResetToken = async (token: string): Promise<{ valid: boolean; email?: string }> => {
  const userId = await redis.getPasswordResetToken(token);

  if (!userId) {
    return { valid: false };
  }

  const reset = (await db
    .knex(PASSWORD_RESET_TABLE)
    .select('id', 'used', 'expires_at')
    .where('token', token)
    .first()) as PasswordResetRow | undefined;

  if (!reset || reset.used || new Date(reset.expires_at) < new Date()) {
    return { valid: false };
  }

  // 获取用户邮箱用于前端显示
  const user = await findById(userId);
  return { valid: true, email: user?.email };
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const result = await verifyResetToken(token);

  if (!result.valid) {
    throw new BadRequestException('Invalid or expired reset token');
  }

  const userId = await redis.getPasswordResetToken(token);
  if (!userId) {
    throw new BadRequestException('Invalid reset token');
  }

  const user = await findById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const hashedPassword = await hashPassword(newPassword);

  await db.knex('users').where('id', userId).update({
    password: hashedPassword,
    updated_at: db.knex.fn.now(),
  });

  await db.knex(PASSWORD_RESET_TABLE).where('token', token).update({ used: true });

  await redis.deletePasswordResetToken(token);

  await redis.removeAllUserRefreshTokens(userId);

  logger.info(`Password reset completed for user: ${user.email} (${userId})`);
};
