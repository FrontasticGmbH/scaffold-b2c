/** @type {import('jest').Config} */
const config = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.test.json', diagnostics: { ignoreCodes: [2307, 7016, 2304] } }],
    '^.+\\.(css|less|sass|scss)$': '<rootDir>/jest/config/styleTransform.js',
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/sdk/',
    '<rootDir>/context/',
    '<rootDir>/components/commercetools-ui/organisms/',
    '<rootDir>/frontastic/hooks/',
    '<rootDir>/frontastic/lib/',
    '<rootDir>/project.config.ts',
    '<rootDir>/helpers/utils/breakpoints/index.ts',
    '<rootDir>/helpers/utils/environment/index.ts',
    '<rootDir>/helpers/utils/i18n/index.ts',
  ],
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^i18n/routing$': '<rootDir>/jest/mocks/i18n-routing.tsx',
    '^next-intl$': '<rootDir>/jest/mocks/next-intl.tsx',
    '^next-intl/(.*)$': '<rootDir>/jest/mocks/next-intl.tsx',
    '^use-intl$': '<rootDir>/jest/mocks/use-intl.ts',
    '^use-intl/(.*)$': '<rootDir>/jest/mocks/use-intl.ts',
    '^shared/types$': '<rootDir>/../types',
    '^shared/types/(.*)$': '<rootDir>/../types/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/jest/config/styleMock.js',
    '^swiper/css$': '<rootDir>/jest/config/styleMock.js',
    '^swiper/css/(.*)$': '<rootDir>/jest/config/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setup/setupTests.ts'],
};

module.exports = config;
