import { test as baseTest } from "@playwright/test"
import { LoginPage } from "../pages/LoginPage"
import { DashboardPage } from "../pages/DashboardPage"
import { UserPage } from "../pages/UserPage"
import { LeftNavigationPage } from "../pages/LeftNavigationPage"
import { PIMPage } from "../pages/PIMPage"


type pomFixtureType = {
    loginPage: LoginPage
    dashboardPage: DashboardPage
    userPage: UserPage
    leftNavPage: LeftNavigationPage
    pimPage: PIMPage
}

//use(): means create LoginPage object using current browser page, then give that object to test so test can work with it
export const test = baseTest.extend<pomFixtureType>({

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page))
    },

    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page))
    },

    userPage: async ({ page }, use) => {
        await use(new UserPage(page))
    },

    leftNavPage: async ({ page }, use) => {
        await use(new LeftNavigationPage(page))
    },

    pimPage: async({page}, use) => {
        await use(new PIMPage(page))
    }
})

/*
   We use Playwright fixtures to centralize and manage test dependencies such as page objects,
   API clients, utilities, and setup/teardown logic.

   Fixtures help us achieve:

   - Dependency injection: automatically provide required objects (e.g., page classes) to tests
   - Code reusability: avoid creating page objects or utilities in every test
   - Clean test code: tests focus only on behavior, not setup details
   - Centralized initialization: all Page Object Model (POM) instances are created in one place
   - Lifecycle control: run setup before tests and cleanup (logout, teardown) after tests
   - Consistent state: ensure all tests start from a predictable environment
   - Scalability: easy to extend framework with new fixtures (API, DB, auth, etc.)

   Instead of manually instantiating classes in each test, we import the extended `test`
   which already contains all required fixtures ready to use.
*/
