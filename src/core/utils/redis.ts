import Redis from 'ioredis';
import { config } from '../config';
import { logger } from './logger';

class RedisClient {
  private client: Redis | null = null;

  connect(): Redis {
    if (!this.client) {
      this.client = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password || undefined,
        db: config.redis.db,
        retryStrategy: times => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      this.client.on('connect', () => {
        logger.info('Redis connected successfully');
      });

      this.client.on('error', error => {
        logger.error('Redis connection error:', error);
      });
    }

    return this.client;
  }

  getClient(): Redis {
    if (!this.client) {
      return this.connect();
    }
    return this.client;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      logger.info('Redis disconnected');
    }
  }

  async setBlacklistToken(token: string, ttlSeconds: number): Promise<void> {
    const client = this.getClient();
    await client.setex(`blacklist:${token}`, ttlSeconds, '1');
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const client = this.getClient();
    const result = await client.get(`blacklist:${token}`);
    return result !== null;
  }

  async storeRefreshToken(userId: number, token: string, ttlSeconds: number): Promise<void> {
    const client = this.getClient();
    await client.setex(`refresh:${userId}:${token}`, ttlSeconds, '1');
  }

  async removeRefreshToken(userId: number, token: string): Promise<void> {
    const client = this.getClient();
    await client.del(`refresh:${userId}:${token}`);
  }

  async removeAllUserRefreshTokens(userId: number): Promise<void> {
    const client = this.getClient();
    const keys = await client.keys(`refresh:${userId}:*`);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  }

  async getRefreshToken(userId: number, token: string): Promise<boolean> {
    const client = this.getClient();
    const result = await client.get(`refresh:${userId}:${token}`);
    return result !== null;
  }

  async setPasswordResetToken(token: string, userId: number, ttlSeconds: number): Promise<void> {
    const client = this.getClient();
    await client.setex(`password_reset:${token}`, ttlSeconds, userId.toString());
  }

  async getPasswordResetToken(token: string): Promise<number | null> {
    const client = this.getClient();
    const result = await client.get(`password_reset:${token}`);
    return result ? parseInt(result, 10) : null;
  }

  async deletePasswordResetToken(token: string): Promise<void> {
    const client = this.getClient();
    await client.del(`password_reset:${token}`);
  }
}

export const redis = new RedisClient();
