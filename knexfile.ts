import { config } from './src/core/config';

const baseConfig = {
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
  seeds: {
    directory: './seeds',
  },
};

export const knexConfig = {
  development: baseConfig,
  production: baseConfig,
  test: baseConfig,
};

export default knexConfig;
