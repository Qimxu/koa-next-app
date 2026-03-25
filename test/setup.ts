/**
 * Jest 测试全局设置
 */

// 设置测试环境变量
(process as any).env.NODE_ENV = 'test';
(process as any).env.JWT_SECRET = 'test-jwt-secret-key-must-be-32-characters';
(process as any).env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-must-be-32-char';

// 禁用日志输出（可选）
// jest.mock('../src/core/utils/logger', () => ({
//   logger: {
//     info: jest.fn(),
//     error: jest.fn(),
//     debug: jest.fn(),
//     warn: jest.fn(),
//   },
// }));
