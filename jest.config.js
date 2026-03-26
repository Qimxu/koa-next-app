module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/test/*.spec.ts'],
  passWithNoTests: true,
  setupFiles: ['<rootDir>/test/setup.ts'],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.server.json',
      },
    ],
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.spec.(t|j)s',
    '!src/**/*.e2e-spec.(t|j)s',
    '!src/**/main.(t|j)s',
    '!src/**/index.(t|j)s',
    '!src/**/*.module.(t|j)s',
    '!src/**/migrations/**',
  ],
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 15,
      lines: 25,
      statements: 25,
    },
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!(jose)/)'],
};
