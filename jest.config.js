module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/?(*.)+(test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  restoreMocks: true,
  resetMocks: true,
  moduleDirectories: ['node_modules', '<rootDir>/src/test'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
