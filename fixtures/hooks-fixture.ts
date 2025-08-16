import { test as baseTest } from "../fixtures/common-fixtures"

/*
This fixture replaces the beforeEach and afterEach hooks in temp-test.spec.ts.

Flow of imports:
1. This file imports from /fixtures/common-fixtures.
2. /fixtures/common-fixtures imports from pom-fixture.ts.

Result:
- When this hooks-fixture.ts is imported into any test file, 
  that test will have access to all fixture objects from:
    - hooks-fixture.ts
    - common-fixtures.ts
    - pom-fixture.ts
*/

type hooksFixture = {

    gotoURL: any
    logout: any
}

export const test = baseTest.extend<hooksFixture>({

/*
 * In Playwright fixtures, the position of `use()` decides what runs
 * before or after the test:
 *
 * - Code written BEFORE `await use()` is setup → it runs first,
 *   before the test body starts. (Example: navigate to a URL, log in, etc.)
 *
 * - The call to `await use()` tells Playwright:
 *   "now run the actual test code that depends on this fixture."
 *
 * - Code written AFTER `await use()` is teardown → it runs after
 *   the test body finishes. (Example: log out, clean up data, etc.)
 *
 * This way, fixtures can prepare the environment before the test
 * and clean up after the test automatically.
 */

    gotoURL: async ({ loginPage }, use) => {

        await loginPage.goToOrangeHRm();
        await use()
    },

    logout: async ({ userPage }, use) => {
        await use()
        await userPage.logoutUser();
    }
})

export { expect } from "@playwright/test"