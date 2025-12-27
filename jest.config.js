module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middlewares/**/*.js',
    'routes/**/*.js',
    'schemas/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
  ],
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
  // Définir NODE_ENV=test pour tous les tests
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
};

