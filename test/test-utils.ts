/**
 * 测试工具函数
 */

import { hashPassword } from '../src/core/utils/helpers';

/**
 * 生成测试用户数据
 */
export const createTestUserData = async (index: number = 1) => {
  const password = await hashPassword('TestPassword123!');
  return {
    name: `Test User ${index}`,
    email: `test${index}@example.com`,
    password,
    role: 'user' as const,
    is_active: true,
  };
};

/**
 * 测试用的 mock 响应对象
 */
export const mockResponse = () => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
};

/**
 * 测试用的 mock Koa 上下文
 */
export const mockContext = (overrides: Record<string, unknown> = {}) => {
  return {
    request: { body: {} },
    response: { status: 200, body: {} },
    state: {},
    headers: {},
    params: {},
    query: {},
    throw: jest.fn(),
    ...overrides,
  };
};

/**
 * 等待指定时间
 */
export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
