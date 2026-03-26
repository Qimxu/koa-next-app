import { ZodSchema, ZodError } from 'zod';
import { Context, Next } from 'koa';
import { BadRequestException } from '../core/exceptions/http.exception';

/**
 * 创建请求体验证中间件
 * 将验证后的数据挂载到 ctx.state.validatedBody
 */
export const validateBody = <T>(schema: ZodSchema<T>) => {
  return async (ctx: Context, next: Next) => {
    try {
      const validated = schema.parse(ctx.request.body);
      ctx.state.validatedBody = validated;
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });
        throw new BadRequestException('Validation failed', errors);
      }
      throw new BadRequestException('Invalid request data');
    }
  };
};

/**
 * 创建查询参数验证中间件
 * 将验证后的数据挂载到 ctx.state.validatedQuery
 */
export const validateQuery = <T>(schema: ZodSchema<T>) => {
  return async (ctx: Context, next: Next) => {
    try {
      const validated = schema.parse(ctx.query);
      ctx.state.validatedQuery = validated;
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });
        throw new BadRequestException('Query validation failed', errors);
      }
      throw new BadRequestException('Invalid query parameters');
    }
  };
};

/**
 * 创建路由参数验证中间件
 * 将验证后的数据挂载到 ctx.state.validatedParams
 */
export const validateParams = <T>(schema: ZodSchema<T>) => {
  return async (ctx: Context, next: Next) => {
    try {
      const validated = schema.parse(ctx.params);
      ctx.state.validatedParams = validated;
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });
        throw new BadRequestException('Parameter validation failed', errors);
      }
      throw new BadRequestException('Invalid route parameters');
    }
  };
};

/**
 * 组合多个验证中间件
 * 用法: router.post('/', combineValidators(validateBody(schema), authMiddleware), handler)
 */
export const combineValidators = (
  ...middlewares: Array<(ctx: Context, next: Next) => Promise<void>>
) => {
  return async (ctx: Context, next: Next) => {
    const executeMiddleware = async (index: number): Promise<void> => {
      if (index >= middlewares.length) {
        return next();
      }
      await middlewares[index](ctx, () => executeMiddleware(index + 1));
    };
    await executeMiddleware(0);
  };
};

// 扩展 Koa Context 类型声明
declare module 'koa' {
  interface DefaultState {
    validatedBody?: unknown;
    validatedQuery?: unknown;
    validatedParams?: unknown;
  }
}
