import { test, expect } from '@playwright/test'


test('soft assertion', async ({ page }) => {
    // failed soft assertions do not terminate test execution, but mark the test as failed.
    await expect.soft(page.getByTestId('status')).toHaveText('Success');
    await expect.soft(page.getByTestId('eta')).toHaveText('1 day');

    // Avoid running further if there were soft assertion failures
    expect(test.info().errors).toHaveLength(0);
})


//custom message appears in Playwright reports and UI only when the assertion fails
test('custom expect messages', async ({ page }) => {
    await expect(page.getByText('Name'), 'should be logged in').toBeVisible();
})


test('expect configure', async ({ page }) => {
    // You can create your own pre-configured expect instance to have its own defaults such as timeout and soft.
    const locator = page.locator("")
    const slowExpect = expect.configure({ timeout: 10000 });
    await slowExpect(locator).toHaveText('Submit');

    // Always do soft assertions.
    const softExpect = expect.configure({ soft: true });
    await softExpect(locator).toHaveText('Submit');
})

/*
This setup combines custom fixtures and custom matchers from multiple modules.

- mergeTests() merges different `test` objects, including their fixtures,
  hooks, and configurations, into a single unified test instance.

- mergeExpects() merges custom matchers so they can be used together
  with a single `expect`.

In this example:
- `dbTest` provides a `database` fixture
- `dbExpect` provides database-related matchers (e.g. toHaveDatabaseUser)
- `a11yTest` and `a11yExpect` provide accessibility fixtures and matchers

After merging:
- You can access all fixtures (e.g. `database`) in one test
- You can use all custom matchers with one `expect`

Example:
test('passes', async ({ database }) => {
  await expect(database).toHaveDatabaseUser('admin'); // custom matcher

fixtures.ts:
import { mergeTests, mergeExpects } from '@playwright/test';
import { test as dbTest, expect as dbExpect } from 'database-test-utils';
import { test as a11yTest, expect as a11yExpect } from 'a11y-test-utils';

There is no practical built-in limit in Playwright. You can merge as many mergeExpects and mergeTests as you need.
export const expect = mergeExpects(dbExpect, a11yExpect);
export const test = mergeTests(dbTest, a11yTest);

dbTest.spec.ts:
import { test, expect } from './fixtures';

test('passes', async ({ database }) => {
  await expect(database).toHaveDatabaseUser('admin');
});
*/


test('expect poll', async ({ page }) => {

    //poll() repeatedly executes a function until returned value matches your expectation or timeout is reached.
    await expect.poll(async () => {
        const response = await page.request.get('https://api.example.com');
        return response.status();
    }, {
        // Custom expect message for reporting, optional.
        message: 'make sure API eventually succeeds',
        // Poll for 10 seconds; defaults to 5 seconds. Pass 0 to disable timeout. 0 means unlimited wait ( until default test timout expires)
        timeout: 10000,
    }).toBe(200);

    //expect poll with expect.configure
    const softExpect = expect.configure({ soft: true });
    await softExpect.poll(async () => {
        const response = await page.request.get('https://api.example.com');
        return response.status();
    }).toBe(200);
})


test('toBeEditable()', async ({ page }) => {

    // Ensures the Locator points to an editable element.
    const locator = page.getByRole('textbox');
    await expect(locator).toBeEditable();
})


test('toHaveCSS()', async ({ page }) => {

    // Ensures the Locator resolves to an element with the given computed CSS style.
    const locator = page.getByRole('button');
    await expect(locator).toHaveCSS('display', 'flex');
})


test('toHaveJSProperty()', async ({ page }) => {

    const locator = page.getByRole('button');
    await expect(locator).toHaveJSProperty('checked', true)
    await expect(locator).toHaveJSProperty('hidden', true);
    await expect(locator).toHaveJSProperty('disabled', true);
    await expect(locator).toHaveJSProperty('value', 'john');
})


test('toHaveProperty()', async ({ }) => {
    const value = {
        a: {
            b: [42],
        },
        c: true,
    };
    expect(value).toHaveProperty('a.b');
    expect(value).toHaveProperty('a.b', [42]);
    expect(value).toHaveProperty('a.b[0]', 42);
    expect(value).toHaveProperty('c');
    expect(value).toHaveProperty('c', true);
})


test('toHaveValue()', async ({ page }) => {
    // for input, textarea and select tags
    const locator = page.getByRole('button');
    await expect(locator).toHaveValue('test@mail.com');
})
