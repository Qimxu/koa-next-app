import winston from 'winston';
import { config } from '../config';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  if (stack) {
    msg += `\n${stack}`;
  }
  return msg;
});

const logger = winston.createLogger({
  level: config.app.isDev ? 'debug' : 'info',
  defaultMeta: { service: 'koa-next-app' },
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat,
      ),
    }),
  ],
});

if (!config.app.isDev) {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        winston.format.json(),
      ),
    }),
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.json()),
    }),
  );
}

export { logger };
export const createRequestLogger = (requestId: string) => {
  return logger.child({ requestId });
};
