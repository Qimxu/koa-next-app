import { Context, Next } from 'koa';

let counter = 0;

/**
 * 请求ID中间件
 * 为每个请求生成唯一追踪ID
 *
 * 使用 nanoid 替代 UUID（更短、更快）
 * 如需更高性能，可改用自增计数器
 */
export const requestIdMiddleware = async (ctx: Context, next: Next) => {
  // 优先使用客户端传入的追踪ID（用于链路追踪）
  const incomingRequestId = ctx.headers['x-request-id'];

  if (incomingRequestId && typeof incomingRequestId === 'string') {
    ctx.state.requestId = incomingRequestId;
  } else {
    // 生成短ID：时间戳(36进制) + 自增计数器
    ctx.state.requestId = `${Date.now().toString(36)}${(counter++ % 1000).toString(36).padStart(3, '0')}`;
  }

  // 响应头返回 requestId，方便客户端追踪
  ctx.set('X-Request-Id', ctx.state.requestId);

  await next();
};
