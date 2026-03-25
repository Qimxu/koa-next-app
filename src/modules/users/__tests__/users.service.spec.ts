import {
  findAllPaginated,
  findById,
  findByEmail,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
  UserRole,
  CreateUserInput,
} from '../users.service';
import { NotFoundException, ConflictException } from '../../../core/exceptions/http.exception';
import type { Knex } from 'knex';

// Mock helpers and logger
jest.mock('../../../core/utils/helpers', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed_password'),
  comparePassword: jest.fn().mockResolvedValue(true),
  generateRandomToken: jest.fn().mockReturnValue('random_token'),
}));

jest.mock('../../../core/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

// 创建 mock chain
const mockChain: any = {
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn(),
  count: jest.fn().mockReturnThis(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  fn: {
    now: jest.fn().mockReturnValue('2024-01-01 00:00:00'),
  },
};

const mockKnex = Object.assign(
  jest.fn(() => mockChain),
  { fn: mockChain.fn }
);

jest.mock('../../../core/utils/database', () => ({
  db: {
    get knex() {
      return mockKnex;
    },
    raw: jest.fn(),
  },
}));

describe('UsersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 重置所有 mock 返回值
    mockChain.select.mockReturnThis();
    mockChain.where.mockReturnThis();
    mockChain.first.mockReset();
    mockChain.orderBy.mockReturnThis();
    mockChain.limit.mockReturnThis();
    mockChain.offset.mockReset();
    mockChain.count.mockReturnThis();
    mockChain.insert.mockReset();
    mockChain.update.mockReset();
    mockChain.delete.mockReset();
  });

  describe('findAllPaginated', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'User 1',
          email: 'user1@example.com',
          role: 'user',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      // 第一次调用 knex() 返回主查询，第二次返回 count 查询
      mockChain.offset.mockResolvedValueOnce(mockUsers);
      mockChain.first.mockResolvedValueOnce({ count: 1 });

      const result = await findAllPaginated(1, 10);

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should calculate total pages correctly', async () => {
      mockChain.offset.mockResolvedValueOnce([]);
      mockChain.first.mockResolvedValueOnce({ count: 25 });

      const result = await findAllPaginated(1, 10);

      expect(result.totalPages).toBe(3);
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockChain.first.mockResolvedValueOnce(mockUser);

      const result = await findById(1);

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.name).toBe('Test User');
    });

    it('should return null when user not found', async () => {
      mockChain.first.mockResolvedValueOnce(undefined);

      const result = await findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user without password by default', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockChain.first.mockResolvedValueOnce(mockUser);

      const result = await findByEmail('test@example.com');

      expect(result).toBeDefined();
      expect(result?.password).toBeUndefined();
    });

    it('should return user with password when requested', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockChain.first.mockResolvedValueOnce(mockUser);

      const result = await findByEmail('test@example.com', true);

      expect(result).toBeDefined();
      expect(result?.password).toBe('hashed_password');
    });

    it('should convert email to lowercase', async () => {
      mockChain.first.mockResolvedValueOnce(undefined);

      await findByEmail('TEST@EXAMPLE.COM');

      expect(mockChain.where).toHaveBeenCalledWith('email', 'test@example.com');
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const input: CreateUserInput = {
        name: 'New User',
        email: 'new@example.com',
        password: 'Password123!',
      };

      // 第一次 first() 检查邮箱是否已存在，第二次获取插入后的用户
      mockChain.first
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({
          id: 1,
          name: 'New User',
          email: 'new@example.com',
          role: 'user',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        });
      mockChain.insert.mockResolvedValueOnce([1]);

      const result = await createUser(input);

      expect(result).toBeDefined();
      expect(result.email).toBe('new@example.com');
      expect(mockChain.insert).toHaveBeenCalled();
    });

    it('should throw ConflictException when email exists', async () => {
      const input: CreateUserInput = {
        name: 'New User',
        email: 'existing@example.com',
        password: 'Password123!',
      };

      mockChain.first.mockResolvedValueOnce({
        id: 1,
        name: 'Existing User',
        email: 'existing@example.com',
        role: 'user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(createUser(input)).rejects.toThrow(ConflictException);
    });

    it('should use default role when not specified', async () => {
      const input: CreateUserInput = {
        name: 'New User',
        email: 'new@example.com',
        password: 'Password123!',
      };

      mockChain.first
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({
          id: 1,
          name: 'New User',
          email: 'new@example.com',
          role: 'user',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        });
      mockChain.insert.mockResolvedValueOnce([1]);

      await createUser(input);

      const insertCall = (mockChain.insert as jest.Mock).mock.calls[0][0];
      expect(insertCall.role).toBe(UserRole.USER);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      // 当只更新 name（不涉及 email）时，调用顺序是：
      // 1. findById(id) 检查用户存在
      // 2. findById(id) 获取更新后的用户（因为不检查 email）
      mockChain.first
        .mockResolvedValueOnce({
          id: 1,
          name: 'Old Name',
          email: 'old@example.com',
          role: 'user',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .mockResolvedValueOnce({
          id: 1,
          name: 'New Name',
          email: 'old@example.com',
          role: 'user',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        });

      mockChain.update.mockResolvedValueOnce(1);

      const result = await updateUser(1, { name: 'New Name' });

      expect(result.name).toBe('New Name');
      expect(mockChain.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockChain.first.mockResolvedValueOnce(undefined);

      await expect(updateUser(999, { name: 'New Name' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when email already in use', async () => {
      mockChain.first
        .mockResolvedValueOnce({
          id: 1,
          name: 'Test User',
          email: 'current@example.com',
          role: 'user',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .mockResolvedValueOnce({
          id: 2,
          email: 'taken@example.com',
        });

      await expect(updateUser(1, { email: 'taken@example.com' })).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockChain.first.mockResolvedValueOnce({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      });

      mockChain.delete.mockResolvedValueOnce(1);

      await deleteUser(1);

      expect(mockChain.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockChain.first.mockResolvedValueOnce(undefined);

      await expect(deleteUser(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePassword', () => {
    it('should update password when current password is correct', async () => {
      mockChain.first.mockResolvedValueOnce({
        password: 'hashed_password',
      });

      mockChain.update.mockResolvedValueOnce(1);

      await updatePassword(1, 'CurrentPassword123!', 'NewPassword123!');

      expect(mockChain.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockChain.first.mockResolvedValueOnce(undefined);

      await expect(updatePassword(999, 'old', 'new')).rejects.toThrow(NotFoundException);
    });
  });
});
