import { test, expect } from '@playwright/test';


/*
TIMEOUTS:
1. set up via config:

export default defineConfig({
  timeout: 40000                 //default 30 secs. it is for each individual test
  globalTimeout: 3_600_000,     //whole suite must finish within time specified in globalTimeout. default no limit
  actionTimeout: 10 * 1000,     //default no limit. but actionTimeout is limited by test timeout. If test timeout (40 secs here) is reached, the test is terminated, and any ongoing action is stopped.
  navigationTimeout: 30 * 1000 //default is 30 secs

expect: {
  timeout: 10_000, //default is 5 secs
  }
});
*/

//2.a. set up per test -> timeout for single action
test('basic test', async ({ page }) => {
    await page.goto('https://playwright.dev', { timeout: 30000 });
    await page.getByText('Get Started').click({ timeout: 10000 });
});

//2.b. set up per test -> timeout for single assertion
test('example', async ({ page }) => {
    const locator = page.getByAltText("locator")
    await expect(locator).toHaveText('hello', { timeout: 10_000 });
});

//3. set up via hooks:
test.beforeAll(async () => {
    test.setTimeout(60000);
});
