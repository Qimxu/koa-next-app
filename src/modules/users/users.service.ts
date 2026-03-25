import { db, UserRow } from '../../core/utils/database';
import { hashPassword, comparePassword } from '../../core/utils/helpers';
import { NotFoundException, ConflictException } from '../../core/exceptions/http.exception';
import { logger } from '../../core/utils/logger';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedUsers {
  items: UserResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const mapUserToResponse = (user: UserRow): UserResponse => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.is_active,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
});

const USERS_TABLE = 'users';

export const findAllPaginated = async (
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedUsers> => {
  const offset = (page - 1) * limit;

  const [users, countResult] = await Promise.all([
    db
      .knex(USERS_TABLE)
      .select('id', 'name', 'email', 'role', 'is_active', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset) as Promise<UserRow[]>,
    db.knex(USERS_TABLE).count('* as count').first() as Promise<{ count: number } | undefined>,
  ]);

  const total = countResult ? Number(countResult.count) : 0;
  const totalPages = Math.ceil(total / limit);

  return {
    items: users.map(mapUserToResponse),
    total,
    page,
    limit,
    totalPages,
  };
};

export const findById = async (id: number): Promise<UserResponse | null> => {
  const user = (await db
    .knex(USERS_TABLE)
    .select('id', 'name', 'email', 'role', 'is_active', 'created_at', 'updated_at')
    .where('id', id)
    .first()) as UserRow | undefined;

  return user ? mapUserToResponse(user) : null;
};

export const findByEmail = async (
  email: string,
  includePassword: boolean = false,
): Promise<(UserResponse & { password?: string }) | null> => {
  const columns = includePassword
    ? ['id', 'name', 'email', 'password', 'role', 'is_active', 'created_at', 'updated_at']
    : ['id', 'name', 'email', 'role', 'is_active', 'created_at', 'updated_at'];

  const user = (await db
    .knex(USERS_TABLE)
    .select(columns)
    .where('email', email.toLowerCase())
    .first()) as UserRow | undefined;

  if (!user) return null;

  const response = mapUserToResponse(user);
  if (includePassword) {
    return { ...response, password: user.password };
  }
  return response;
};

export const createUser = async (input: CreateUserInput): Promise<UserResponse> => {
  const existingUser = await findByEmail(input.email);
  if (existingUser) {
    throw new ConflictException('User with this email already exists');
  }

  const hashedPassword = await hashPassword(input.password);

  const [insertId] = await db.knex(USERS_TABLE).insert({
    name: input.name,
    email: input.email.toLowerCase(),
    password: hashedPassword,
    role: input.role || UserRole.USER,
    is_active: true,
    created_at: db.knex.fn.now(),
    updated_at: db.knex.fn.now(),
  });

  const user = await findById(insertId);
  if (!user) {
    throw new Error('Failed to create user');
  }

  logger.info(`User created: ${user.email} (${user.id})`);
  return user;
};

export const updateUser = async (id: number, input: UpdateUserInput): Promise<UserResponse> => {
  const existingUser = await findById(id);
  if (!existingUser) {
    throw new NotFoundException('User not found');
  }

  if (input.email && input.email !== existingUser.email) {
    const emailExists = await findByEmail(input.email);
    if (emailExists) {
      throw new ConflictException('Email already in use');
    }
  }

  const updateData: Record<string, unknown> = {};

  if (input.name !== undefined) {
    updateData.name = input.name;
  }
  if (input.email !== undefined) {
    updateData.email = input.email.toLowerCase();
  }
  if (input.role !== undefined) {
    updateData.role = input.role;
  }
  if (input.isActive !== undefined) {
    updateData.is_active = input.isActive;
  }

  if (Object.keys(updateData).length === 0) {
    return existingUser;
  }

  updateData.updated_at = db.knex.fn.now();

  await db.knex(USERS_TABLE).where('id', id).update(updateData);

  const updatedUser = await findById(id);
  if (!updatedUser) {
    throw new Error('Failed to update user');
  }

  logger.info(`User updated: ${updatedUser.email} (${updatedUser.id})`);
  return updatedUser;
};

export const deleteUser = async (id: number): Promise<void> => {
  const user = await findById(id);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  await db.knex(USERS_TABLE).where('id', id).delete();
  logger.info(`User deleted: ${user.email} (${id})`);
};

export const updatePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  const user = (await db.knex(USERS_TABLE).select('password').where('id', userId).first()) as
    | { password: string }
    | undefined;

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const isValidPassword = await comparePassword(currentPassword, user.password);
  if (!isValidPassword) {
    throw new ConflictException('Current password is incorrect');
  }

  const hashedPassword = await hashPassword(newPassword);

  await db.knex(USERS_TABLE).where('id', userId).update({
    password: hashedPassword,
    updated_at: db.knex.fn.now(),
  });

  logger.info(`Password updated for user: ${userId}`);
};
