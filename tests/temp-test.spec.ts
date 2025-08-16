import { expect } from "@playwright/test";
import { test } from "../fixtures/hooks-fixture"

//as login server remembers login from same browser after first login with cred there is no need to use credentials for login. 
//login is done with global-setup.ts file first time.
//hooks are provided via hooks-fixture.ts file therefore this code is commented out. It just for reference
// test.beforeEach('BeforeEach Hook',async({page, loginPage}) => {
//     await loginPage.goToOrangeHRm();
//     await expect(page).toHaveTitle('OrangeHRM');
// })

// test.afterEach('AfterEach Hook',async({page, userPage}) => {
//     await userPage.logoutUser()
// })

//loginPage, commonUtils comes from /fixtures/hooks-fixtures as test is imported there from common-fixtures.ts.
test('Temp test', async ({ page, commonUtils, gotoURL }) => {

    const decryptUsername = commonUtils.decryptedData(process.env.USER_NAME!) //"!" means process.env.USER_NAME will not be null or undefined at runtime, so don’t give me a compile-time error 
    const decryptPwd = commonUtils.decryptedData(process.env.PASSWORD!)
    console.log({ decryptUsername })
    console.log({ decryptPwd })

    // await loginPage.login(decryptUsername, decryptPwd) this line not needed as from config file in projects section 'Setup' is configured
    // So after 1 login server will recognize browser and login will be no more required for each test.
    console.log("Page Title: " + await page.title())
})

test("Temp test 2", async ({ page, gotoURL }) => {
    await expect(page).toHaveTitle('OrangeHRM');
});

/*
- `gotoURL` (from hooks-fixture) runs at the start of each test to navigate to the target URL.
- `logout` (from hooks-fixture) runs after the last test to log out.
- Even if these fixtures appear unused in the function signature (greyed out), 
  they still execute automatically when included.
*/
test("Temp test 3", async ({ page, gotoURL, logout }) => {
    await expect(page).toHaveTitle('OrangeHRM');
});
