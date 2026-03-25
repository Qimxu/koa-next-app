const createNextIntlPlugin = require('next-intl/plugin');
const { load } = require('js-yaml');
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

function loadYamlConfig(nodeEnv) {
  const env = nodeEnv === 'test' ? 'development' : (nodeEnv || 'development');
  const configFile = `app.config.${env}.yaml`;
  const configPath = join(process.cwd(), 'config', configFile);

  if (!existsSync(configPath)) {
    console.warn(`Config file not found: ${configPath}`);
    return {};
  }

  try {
    return load(readFileSync(configPath, 'utf-8')) || {};
  } catch (e) {
    console.error(`Failed to load config: ${configPath}`, e);
    return {};
  }
}

const config = loadYamlConfig(process.env.NODE_ENV);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: '.next',
  env: {
    API_BASE_URL: config.app?.apiBaseUrl || 'http://localhost:3001',
    NEXT_PUBLIC_API_BASE_URL: config.app?.apiBaseUrl || 'http://localhost:3001',
  },
};

module.exports = withNextIntl(nextConfig);
