import {
  login,
  register,
  refreshToken,
  logout,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  LoginInput,
  RegisterInput,
} from '../auth.service';
import * as usersService from '../../users/users.service';
import * as databaseModule from '../../../core/utils/database';
import * as redisModule from '../../../core/utils/redis';
import * as jwtUtils from '../../../core/utils/jwt';
import {
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '../../../core/exceptions/http.exception';

// Mock 依赖
jest.mock('../../users/users.service');
jest.mock('../../../core/utils/redis');
jest.mock('../../../core/utils/jwt');
jest.mock('../../../core/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));
jest.mock('../../../core/utils/helpers', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed_password'),
  comparePassword: jest.fn().mockResolvedValue(true),
  generateRandomToken: jest.fn().mockReturnValue('random_token_32_chars_long_here'),
  parseDurationToSeconds: jest.fn().mockReturnValue(604800),
}));

// Mock Database class
type MockKnexChain = {
  where: jest.Mock;
  select: jest.Mock;
  first: jest.Mock;
  insert: jest.Mock;
  update: jest.Mock;
  fn: {
    now: jest.Mock;
  };
};

const createMockKnexChain = (): MockKnexChain => ({
  where: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  first: jest.fn().mockResolvedValue(undefined),
  insert: jest.fn().mockResolvedValue([1]),
  update: jest.fn().mockResolvedValue(1),
  fn: {
    now: jest.fn().mockReturnValue('2024-01-01 00:00:00'),
  },
});

// Create mock knex function that returns chain methods
const mockKnexFn = Object.assign(
  jest.fn(),
  {
    fn: {
      now: jest.fn().mockReturnValue('2024-01-01 00:00:00'),
    },
  }
);
const mockKnexChain = createMockKnexChain();

// Setup mock knex to return chain methods
mockKnexFn.mockImplementation(() => mockKnexChain);

// Mock the database module
jest.mock('../../../core/utils/database', () => ({
  db: {
    get knex() {
      return mockKnexFn;
    },
  },
}));

// Mock redis module - 使用工厂函数内部定义 mockRedisClient
jest.mock('../../../core/utils/redis', () => {
  const mockRedisClient = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  };
  return {
    redis: {
      storeRefreshToken: jest.fn().mockResolvedValue(undefined),
      getRefreshToken: jest.fn().mockResolvedValue(true),
      removeRefreshToken: jest.fn().mockResolvedValue(undefined),
      removeAllUserRefreshTokens: jest.fn().mockResolvedValue(undefined),
      setBlacklistToken: jest.fn().mockResolvedValue(undefined),
      setPasswordResetToken: jest.fn().mockResolvedValue(undefined),
      getPasswordResetToken: jest.fn().mockResolvedValue(1),
      deletePasswordResetToken: jest.fn().mockResolvedValue(undefined),
      getClient: jest.fn().mockReturnValue(mockRedisClient),
    },
  };
});

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock chain results
    mockKnexChain.first.mockResolvedValue(undefined);
    mockKnexChain.update.mockResolvedValue(1);
    mockKnexChain.insert.mockResolvedValue([1]);
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: '$2b$12$hashedpasswordhashhere1234567890abcdef',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);
      jest.spyOn(jwtUtils, 'generateTokens').mockResolvedValue({
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
      });

      const input: LoginInput = {
        email: 'test@example.com',
        password: 'CorrectPassword123!',
      };

      const result = await login(input);

      expect(result).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.tokens).toBeDefined();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      const input: LoginInput = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      await expect(login(input)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when account is disabled', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'user',
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);

      const input: LoginInput = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      await expect(login(input)).rejects.toThrow('Account is disabled');
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockCreatedUser = {
        id: 1,
        name: 'New User',
        email: 'new@example.com',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usersService, 'createUser').mockResolvedValue(mockCreatedUser as any);
      jest.spyOn(jwtUtils, 'generateTokens').mockResolvedValue({
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
      });

      const input: RegisterInput = {
        name: 'New User',
        email: 'new@example.com',
        password: 'Password123!',
      };

      const result = await register(input);

      expect(result).toBeDefined();
      expect(result.user.email).toBe('new@example.com');
      expect(result.tokens).toBeDefined();
    });

    it('should throw error when email already exists', async () => {
      const { ConflictException } = await import('../../../core/exceptions/http.exception');
      jest.spyOn(usersService, 'createUser').mockRejectedValue(
        new ConflictException('User with this email already exists')
      );

      const input: RegisterInput = {
        name: 'New User',
        email: 'existing@example.com',
        password: 'Password123!',
      };

      await expect(register(input)).rejects.toThrow();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token with valid refresh token', async () => {
      jest.spyOn(jwtUtils, 'verifyRefreshToken').mockResolvedValue({
        sub: 1,
        email: 'test@example.com',
        role: 'user',
        type: 'refresh',
      });
      (redisModule.redis.getRefreshToken as jest.Mock).mockResolvedValue(true);
      jest.spyOn(usersService, 'findById').mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      jest.spyOn(jwtUtils, 'generateTokens').mockResolvedValue({
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      });

      const result = await refreshToken('valid_refresh_token');

      expect(result).toBeDefined();
      expect(result.access_token).toBe('new_access_token');
      expect(redisModule.redis.removeRefreshToken).toHaveBeenCalled();
      expect(redisModule.redis.storeRefreshToken).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid token type', async () => {
      jest.spyOn(jwtUtils, 'verifyRefreshToken').mockResolvedValue({
        sub: 1,
        email: 'test@example.com',
        role: 'user',
        type: 'access',
      });

      await expect(refreshToken('invalid_type_token')).rejects.toThrow('Invalid token type');
    });

    it('should throw UnauthorizedException for blacklisted token', async () => {
      jest.spyOn(jwtUtils, 'verifyRefreshToken').mockResolvedValue({
        sub: 1,
        email: 'test@example.com',
        role: 'user',
        type: 'refresh',
      });
      (redisModule.redis.getRefreshToken as jest.Mock).mockResolvedValue(null);

      await expect(refreshToken('blacklisted_token')).rejects.toThrow(
        'Invalid or expired refresh token'
      );
    });

    it('should throw UnauthorizedException when user is disabled', async () => {
      jest.spyOn(jwtUtils, 'verifyRefreshToken').mockResolvedValue({
        sub: 1,
        email: 'test@example.com',
        role: 'user',
        type: 'refresh',
      });
      (redisModule.redis.getRefreshToken as jest.Mock).mockResolvedValue(true);
      jest.spyOn(usersService, 'findById').mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      await expect(refreshToken('valid_token')).rejects.toThrow('User not found or disabled');
    });
  });

  describe('logout', () => {
    it('should logout user and blacklist token', async () => {
      jest.spyOn(jwtUtils, 'getTokenExpiresInSeconds').mockReturnValue(1800);
      (redisModule.redis.getClient as jest.Mock)().keys.mockResolvedValue([]);

      await logout(1, 'valid_access_token');

      expect(redisModule.redis.setBlacklistToken).toHaveBeenCalledWith('valid_access_token', 1800);
    });

    it('should remove all user refresh tokens', async () => {
      jest.spyOn(jwtUtils, 'getTokenExpiresInSeconds').mockReturnValue(1800);
      (redisModule.redis.getClient as jest.Mock)().keys.mockResolvedValue([
        'refresh:1:token1',
        'refresh:1:token2',
      ]);

      await logout(1, 'valid_access_token');

      expect(redisModule.redis.removeRefreshToken).toHaveBeenCalledTimes(2);
    });
  });

  describe('forgotPassword', () => {
    it('should generate reset token for existing user', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await forgotPassword('test@example.com');

      expect(result.message).toContain('If an account exists');
      expect(mockKnexFn).toHaveBeenCalledWith('password_resets');
      expect(redisModule.redis.setPasswordResetToken).toHaveBeenCalled();
    });

    it('should return same message for non-existent user', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      const result = await forgotPassword('nonexistent@example.com');

      expect(result.message).toContain('If an account exists');
      expect(mockKnexChain.insert).not.toHaveBeenCalled();
    });
  });

  describe('verifyResetToken', () => {
    it('should return valid and email for valid token', async () => {
      (redisModule.redis.getPasswordResetToken as jest.Mock).mockResolvedValue(1);
      jest.spyOn(usersService, 'findById').mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      mockKnexChain.first.mockResolvedValue({
        id: 1,
        used: false,
        expires_at: new Date(Date.now() + 3600000),
      });

      const result = await verifyResetToken('valid_token');

      expect(result.valid).toBe(true);
      expect(result.email).toBe('test@example.com');
    });

    it('should return valid: false for expired token', async () => {
      (redisModule.redis.getPasswordResetToken as jest.Mock).mockResolvedValue(1);
      mockKnexChain.first.mockResolvedValue({
        id: 1,
        used: false,
        expires_at: new Date(Date.now() - 3600000),
      });

      const result = await verifyResetToken('expired_token');

      expect(result.valid).toBe(false);
    });

    it('should return valid: false for already used token', async () => {
      (redisModule.redis.getPasswordResetToken as jest.Mock).mockResolvedValue(1);
      mockKnexChain.first.mockResolvedValue({
        id: 1,
        used: true,
        expires_at: new Date(Date.now() + 3600000),
      });

      const result = await verifyResetToken('used_token');

      expect(result.valid).toBe(false);
    });

    it('should return valid: false for non-existent token in redis', async () => {
      (redisModule.redis.getPasswordResetToken as jest.Mock).mockResolvedValue(null);

      const result = await verifyResetToken('invalid_token');

      expect(result.valid).toBe(false);
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      (redisModule.redis.getPasswordResetToken as jest.Mock).mockResolvedValue(1);
      mockKnexChain.first.mockResolvedValue({
        id: 1,
        used: false,
        expires_at: new Date(Date.now() + 3600000),
      });
      jest.spyOn(usersService, 'findById').mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      await resetPassword('valid_token', 'NewPassword123!');

      expect(mockKnexChain.update).toHaveBeenCalledTimes(2);
      expect(redisModule.redis.deletePasswordResetToken).toHaveBeenCalled();
      expect(redisModule.redis.removeAllUserRefreshTokens).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid token', async () => {
      (redisModule.redis.getPasswordResetToken as jest.Mock).mockResolvedValue(null);

      await expect(resetPassword('invalid_token', 'NewPassword123!')).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      (redisModule.redis.getPasswordResetToken as jest.Mock).mockResolvedValue(999);
      mockKnexChain.first.mockResolvedValue({
        id: 1,
        used: false,
        expires_at: new Date(Date.now() + 3600000),
      });
      jest.spyOn(usersService, 'findById').mockResolvedValue(null);

      await expect(resetPassword('valid_token', 'NewPassword123!')).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
