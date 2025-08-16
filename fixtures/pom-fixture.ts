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

//use(): means reate LoginPage object using current browser page, then give that object to test so test can work with it
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
We use Playwright fixtures to avoid manually creating page class instances in every test.
Fixtures instantiate the page classes once here, so tests can simply import `test` 
and use the page objects directly.
*/
