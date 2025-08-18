import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv'

dotenv.config({
  path: process.env.ENV_NAME ? `./env-files/.env.${process.env.ENV_NAME}` : `./env-files/.env.demo`
})

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 40000,
  testDir: './tests/ui-tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'on-failure' }]], //it opens report after tests
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  expect: { //this timeout is only for expect assertion
    timeout: 25000
  },
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Setup',
      testMatch: 'global-setup.ts' //allows to access browser without login to site each time. Saves time for each test
    },
    {
      name: 'chromium',
      dependencies: ['Setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: './playwright/auth/auth.json'
      },
    },

    {
      name: 'firefox',
      dependencies: ['Setup'],
      use: {
        ...devices['Desktop Firefox'],
        storageState: './playwright/auth/auth.json'
      },
    },
    {
      name: 'APITest',
      testDir: './tests/api-tests',
      use: {
        baseURL: process.env.API_BASE_URL,
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // "Authorization": "Basic YWRtaW46cGFzc3dvcmQxMjM="
        }
      }
    }

    // {
    //   name: 'webkit',
    // dependencies:['Setup'],
    //   use: { ...devices['Desktop Safari'],
    //         storageState: './playwright/auth/auth.json'
    //  },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});


