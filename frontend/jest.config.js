/** @type {import('jest').Config} */
const config = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.test.json', diagnostics: { ignoreCodes: [2307, 7016, 2304] } }],
    '^.+\\.jsx?$': [
      'babel-jest',
      {
        presets: ['@babel/preset-env'],
        plugins: [['@babel/transform-runtime']],
      },
    ],
    '^.+\\.(css|less|sass|scss)$': '<rootDir>/jest/config/styleTransform.js',
  },
  transformIgnorePatterns: ['node_modules\\/(?!(swiper|ssr-window|dom7))'],
  coveragePathIgnorePatterns: [
    '<rootDir>/sdk/',
    '<rootDir>/context/',
    '<rootDir>/components/commercetools-ui/organisms/',
    '<rootDir>/frontastic/hooks/',
    '<rootDir>/frontastic/lib/',
    '<rootDir>/project.config.ts',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^shared/types$': '<rootDir>/../types',
    '^shared/types/(.*)$': '<rootDir>/../types/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/jest/config/styleMock.js',
    '^swiper/css$': '<rootDir>/jest/config/styleMock.js',
    '^swiper/css/(.*)$': '<rootDir>/jest/config/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setup/setupTests.ts'],
};

module.exports = config;
