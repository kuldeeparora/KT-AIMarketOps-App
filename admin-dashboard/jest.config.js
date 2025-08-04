module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__', '<rootDir>/lib', '<rootDir>/utils'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  collectCoverageFrom: [
    'lib/**/*.{js,ts}',
    'utils/**/*.{js,ts}',
    'pages/api/**/*.{js,ts}',
    '!**/*.d.ts',
    '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80}
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@types/(.*)$': '<rootDir>/types/$1'
  }
};