import { z } from 'zod';
import { UserRole } from '../users.service';

/**
 * 创建用户 DTO
 */
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.nativeEnum(UserRole).optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

/**
 * 更新用户 DTO
 */
export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

/**
 * 分页查询 DTO
 */
export const paginationSchema = z.object({
  page: z.preprocess(val => (val ? parseInt(String(val), 10) : 1), z.number().min(1).default(1)),
  limit: z.preprocess(
    val => (val ? parseInt(String(val), 10) : 10),
    z.number().min(1).max(100).default(10),
  ),
});

export type PaginationDto = z.infer<typeof paginationSchema>;

/**
 * 路由参数 ID DTO
 */
export const paramsIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

export type ParamsIdDto = z.infer<typeof paramsIdSchema>;
