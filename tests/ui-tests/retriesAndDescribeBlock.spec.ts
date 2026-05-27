import { test } from '@playwright/test';

/*
RETRIES:
1. add via config file:
export default defineConfig({ retries: 3 });

2. add via CLI: npx playwright test --retries=3

3. add in describe group:

test.describe(() => {
test.describe.configure({ retries: 2 });

  test('test 1', async ({ page }) => {});
  test('test 2', async ({ page }) => {});
});

When running tests without retries if 1 test fails tests after that are skipped. With retries playwright kills worker and starts a new worker from failed test.
It makes sure failing test does not affect other tests. 
*/
test.describe(() => {
    // All tests in this describe group will get 2 retry attempts.
    test.describe.configure({ retries: 2 });

    test('test 1', async ({ }) => {
        console.log("test 1")
    });

    test('test 2', async ({ }) => {
        console.log("test 2")
    });
});

/*
Use test.describe.serial() (or test.describe.configure({ mode: 'serial' })) to group dependent tests to ensure they will always run together and in order. 
If one of the tests fails, all subsequent tests are skipped. All tests in the group are retried together.
It is better to run tests in isolation or with regular retry to not affect other tests. serial mode is for tests dependent on each other
*/
test.describe(() => {
    // All tests in this describe group will get 2 retry attempts.
    test.describe.configure({ mode: 'serial' });

    test('test 1', async ({ }) => {
        console.log("test 1")
    });

    test('test 2', async ({ }) => {
        console.log("test 2")
    });
});


//multiple describe run in parallel. just add 2 workers in config.
test.describe.configure({ mode: 'parallel' });

test.describe('A, runs in parallel with B', () => {
    test.describe.configure({ mode: 'default' });
    test('in order A1', async ({ page }) => { });
    test('in order A2', async ({ page }) => { });
});

test.describe('B, runs in parallel with A', () => {
    test.describe.configure({ mode: 'default' });
    test('in order B1', async ({ page }) => { });
    test('in order B2', async ({ page }) => { });
});


//Tests in this group are marked as "fixme" and will not be executed
test.describe.fixme('broken tests that should be fixed', () => {
    test('example', async ({ page }) => {
    });
});


//This single test marked as "fixme" will not be executed
test.fixme('to be fixed', async ({ page }) => {
});


//this test is expected to fail. if it passes playwright marks it as failed
test.fail('not yet ready', async ({ page }) => {
});


//Sets the maximum allowed execution time for the entire test to 120 secs
test('very slow test', async ({ page }) => {
    test.setTimeout(120000);
});


//Changing timeout for all tests in a test.describe() group.
test.describe('group', () => {
    // Applies to all tests in this group.
    test.describe.configure({ timeout: 60000 });

    test('test one', async () => { /* ... */ });
    test('test two', async () => { /* ... */ });
    test('test three', async () => { /* ... */ });
});


/*
Marks a test as "slow". Slow test will be given triple the default timeout.
Note that test.slow() cannot be used in a beforeAll or afterAll hook. Use test.setTimeout() instead.
You can mark a test as slow by calling test.slow() inside the test body.
*/
test('slow test', async ({ page }) => {
    test.slow();
});


//If test is slow in some configurations, but not all, can mark it as slow based on condition. Pass description argument in this case.
test('slow in Safari', async ({ page, browserName }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
});


//Declares a test step that is shown in the report.
test('test', async ({ page }) => {
    await test.step('Log in', async () => {
        await page.click('button');
    });

    await test.step('Outer step', async () => {

        // You can nest steps inside each other.
        await test.step('Inner step', async () => {
        });
    });
});