import path from 'path';
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 2,
  workers: 1,
  reporter: 'html',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:3000',
    // baseURL: 'https://poc-b2cdev.frontend.site/en/',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'mobileChrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    //
  ],
  // webServer: process.env.CI
  //   ? undefined
  //   : {
  //       command: 'yarn start',
  //       url: 'http://127.0.0.1:3000',
  //       reuseExistingServer: true,
  //       timeout: 120000,
  //     },
});
