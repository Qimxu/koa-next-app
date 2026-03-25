/**
 * 全局类型定义
 */

// API 相关类型
export interface ApiErrorResponse {
  message: string;
  code?: string;
}

// 表单相关类型
export interface FormErrors {
  [key: string]: string | undefined;
}

// 通用工具类型
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// 从 services 重新导出常用类型
export type { User, UserRole, CreateUserParams } from '@/services';
export type {
  LoginParams,
  LoginResponse,
  RegisterParams,
  ForgotPasswordParams,
  ResetPasswordParams,
} from '@/services';
