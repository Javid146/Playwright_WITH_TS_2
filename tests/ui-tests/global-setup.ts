import { expect } from "@playwright/test"
import { test } from "../../fixtures/common-fixtures"

test("Global setup auto-Login", async ({ page, loginPage, dashboardPage, commonUtils }) => {

    const decryptUsername = commonUtils.decryptedData(process.env.USER_NAME!) //"!" means process.env.USER_NAME will not be null or undefined at runtime, so don’t give me a compile-time error 
    const decryptPwd = commonUtils.decryptedData(process.env.PASSWORD!)
    console.log({ decryptUsername })
    console.log({ decryptPwd })

    await loginPage.goToOrangeHRm()
    await loginPage.login(decryptUsername, decryptPwd)

    await page.waitForURL(process.env.BASE_URL + '/web/index.php/dashboard/index')
    await expect(dashboardPage.dashboardTitleText).toHaveText("Dashboard", { timeout: 10000 })

    // Saves the login state to the browser, so next time the server recognizes this browser 
    // and no credentials are needed to log in again. Saves time for each test
    await page.context().storageState({
        path: './playwright/auth/auth.json'
    })
})