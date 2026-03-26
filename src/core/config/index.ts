import path from 'path';
import { readFileSync, existsSync } from 'fs';
import { load } from 'js-yaml';

function resolveConfigEnv(nodeEnv?: string): string {
  const env = nodeEnv || process.env.NODE_ENV || 'development';
  return env === 'test' ? 'development' : env;
}

/**
 * 替换配置值中的环境变量占位符
 * 支持 ${ENV_VAR} 或 ${ENV_VAR:defaultValue} 格式
 */
function replaceEnvVars(obj: any): any {
  if (typeof obj === 'string') {
    return obj.replace(/\$\{([^}]+)\}/g, (match, envExpr) => {
      const [envKey, defaultValue] = envExpr.split(':');
      const value = process.env[envKey.trim()];
      if (value !== undefined) return value;
      if (defaultValue !== undefined) return defaultValue.trim();
      // 生产环境强制要求设置环境变量
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Missing required environment variable: ${envKey}`);
      }
      return match; // 开发环境保留原样作为提示
    });
  }
  if (Array.isArray(obj)) {
    return obj.map(replaceEnvVars);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, replaceEnvVars(value)]),
    );
  }
  return obj;
}

function loadYamlConfig(env: string): Record<string, any> {
  const configDir = path.join(process.cwd(), 'config');
  const configFile = `app.config.${env}.yaml`;
  const configPath = path.join(configDir, configFile);

  if (!existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    const rawConfig = (load(content) as Record<string, any>) || {};
    return replaceEnvVars(rawConfig);
  } catch (e) {
    throw new Error(`Failed to load config: ${configPath} - ${e}`);
  }
}

// 加载 YAML 配置
const env = resolveConfigEnv();
const yaml = loadYamlConfig(env);

// 敏感配置验证 - 生产环境必须设置
if (env === 'production') {
  const jwtSecret = yaml.jwt?.secret || process.env.JWT_SECRET;
  const jwtRefreshSecret = yaml.jwt?.refreshSecret || process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret || jwtSecret.includes('your-') || jwtSecret.length < 32) {
    throw new Error('Production requires a secure JWT_SECRET (min 32 chars, not a placeholder)');
  }
  if (!jwtRefreshSecret || jwtRefreshSecret.includes('your-') || jwtRefreshSecret.length < 32) {
    throw new Error(
      'Production requires a secure JWT_REFRESH_SECRET (min 32 chars, not a placeholder)',
    );
  }
}

// 统一配置对象：所有配置从 YAML 读取，支持环境变量覆盖
export const config = {
  app: {
    env: env,
    port: yaml.app?.port || 3001,
    isDev: env === 'development',
    isProd: env === 'production',
    apiBaseUrl: yaml.app?.apiBaseUrl || `http://localhost:${yaml.app?.port || 3001}`,
  },
  database: {
    type: yaml.db?.type || 'mysql',
    host: yaml.db?.host || 'localhost',
    port: yaml.db?.port || 3306,
    username: yaml.db?.username || 'root',
    password: yaml.db?.password || '',
    database: yaml.db?.database || 'koa_next_app',
    synchronize: yaml.db?.synchronize ?? true,
    connectionLimit: yaml.db?.connectionLimit || 10,
  },
  redis: {
    host: yaml.redis?.host || 'localhost',
    port: yaml.redis?.port || 6379,
    password: yaml.redis?.password || '',
    db: yaml.redis?.db || 0,
  },
  jwt: {
    secret: yaml.jwt?.secret || process.env.JWT_SECRET || '',
    refreshSecret: yaml.jwt?.refreshSecret || process.env.JWT_REFRESH_SECRET || '',
    expiresIn: yaml.jwt?.expiresIn || '30m',
    refreshExpiresIn: yaml.jwt?.refreshExpiresIn || '7d',
  },
  mail: {
    host: yaml.mail?.host || '',
    port: yaml.mail?.port || 587,
    user: yaml.mail?.user || '',
    pass: yaml.mail?.pass || '',
    from: yaml.mail?.from || '',
  },
  security: {
    bcryptRounds: yaml.security?.bcryptRounds || 12,
    rateLimitWindowMs: yaml.throttle?.ttl || 60000,
    rateLimitMax: yaml.throttle?.limit || 100,
  },
  // 其他从 YAML 加载的配置
  ...Object.keys(yaml)
    .filter(key => !['app', 'db', 'redis', 'jwt', 'throttle', 'mail', 'security'].includes(key))
    .reduce((acc, key) => ({ ...acc, [key]: yaml[key] }), {}),
};

export default config;
