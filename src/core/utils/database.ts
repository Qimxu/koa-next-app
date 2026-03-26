import knex from 'knex';
import { config } from '../config';
import { logger } from './logger';

// Knex 类型别名 - 使用 ReturnType 推断类型
type KnexInstance = ReturnType<typeof knex>;
type KnexTransaction = Parameters<Parameters<KnexInstance['transaction']>[0]>[0];

class Database {
  private instance: KnexInstance | null = null;

  async initialize(): Promise<void> {
    try {
      // 第一步：连接到 MySQL（不指定数据库），检查并创建数据库
      await this.ensureDatabaseExists();

      // 第二步：连接到指定的数据库
      this.instance = knex({
        client: 'mysql2',
        connection: {
          host: config.database.host,
          port: config.database.port,
          user: config.database.username,
          password: config.database.password,
          database: config.database.database,
        },
        pool: {
          min: 2,
          max: config.database.connectionLimit || 10,
        },
        migrations: {
          directory: './migrations',
          tableName: 'knex_migrations',
        },
      });

      // 测试连接
      await this.instance.raw('SELECT 1');

      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  /**
   * 确保数据库存在，如果不存在则自动创建
   */
  private async ensureDatabaseExists(): Promise<void> {
    const tempKnex = knex({
      client: 'mysql2',
      connection: {
        host: config.database.host,
        port: config.database.port,
        user: config.database.username,
        password: config.database.password,
        // 不指定数据库，连接到 MySQL 服务器
      },
    });

    try {
      const dbName = config.database.database;

      // 检查数据库是否存在
      const result = await tempKnex.raw(
        'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
        [dbName],
      );

      if (result[0].length === 0) {
        // 数据库不存在，创建它
        logger.info(`Database '${dbName}' not found, creating...`);
        await tempKnex.raw(
          `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
        );
        logger.info(`Database '${dbName}' created successfully`);
      } else {
        logger.info(`Database '${dbName}' already exists`);
      }
    } catch (error) {
      logger.error('Failed to check/create database:', error);
      throw error;
    } finally {
      await tempKnex.destroy();
    }
  }

  get knex(): KnexInstance {
    if (!this.instance) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  /**
   * 获取 Knex 查询构建器实例
   */
  get queryBuilder(): KnexInstance {
    return this.knex;
  }

  /**
   * 执行原始 SQL 查询（保留向后兼容）
   */
  async raw<T = unknown>(sql: string, bindings?: unknown[]): Promise<T> {
    const result = await this.knex.raw(sql, bindings as string[]);
    return result[0] as T;
  }

  /**
   * 执行 SQL 查询 (别名，用于 scripts 兼容)
   */
  async query<T = unknown>(sql: string, bindings?: unknown[]): Promise<T> {
    return this.raw<T>(sql, bindings);
  }

  /**
   * 事务处理
   */
  async transaction<T>(callback: (trx: KnexTransaction) => Promise<T>): Promise<T> {
    return this.knex.transaction(callback);
  }

  /**
   * 关闭数据库连接
   */
  async close(): Promise<void> {
    if (this.instance) {
      await this.instance.destroy();
      this.instance = null;
      logger.info('Database connection closed');
    }
  }
}

export const db = new Database();

// 便捷导出 - 用户表接口
export interface UserRow {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// 便捷导出 - Refresh Token 表接口
export interface RefreshTokenRow {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
}

// 便捷导出 - 密码重置表接口
export interface PasswordResetRow {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
}
