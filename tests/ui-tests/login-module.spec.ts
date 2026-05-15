import { test } from "../../fixtures/hooks-fixture"
import { expect } from "@playwright/test";
import loginModuleData from "../../test-data/ui-data/login-module-data.json" //loginModuleData is not actual name of file, alias

/*
ALL TESTS REQUIRE THE SECRET KEY.  

You can then run the tests using either:  
1. npm script from package.json, e.g.: 
CMD:        set SECRET_KEY=javid5 && npm run uat_cr_hd //script run
CMD:        set SECRET_KEY=javid5 && npx playwright test login-module.spec.ts
Bash:       SECRET_KEY=javid5 npx playwright test login-module.spec.ts
PWRSHL:     $env:SECRET_KEY="javid5"; npx playwright test login-module.spec.ts


This test overrides the saved browser state from global-setup.ts. 
Normally, tests use the stored state to access the OrangeHRM site without logging in. 
By clearing cookies and origins here, we ensure the login page is shown, 
allowing us to test login functionality with invalid credentials. 
Without this, the browser would auto-login and skip the login flow. 
*/
test.use({
    storageState: {
        cookies: [],
        origins: []
    }
});

test('[Login] Verify that the user cannot log in with an invalid password', {
    tag: ['@ui', '@uat'],
    annotation: {
        type: 'Test Case Link',
        description: 'paste Jira link or something here'
    }
}, async ({ gotoURL, loginPage, commonUtils, page }) => {
    const username = commonUtils.decryptedData(process.env.USER_NAME!);
    await loginPage.login(username, loginModuleData.wrong_password);
    await expect(loginPage.invalidCredentialErrorPopup).toHaveText(loginModuleData.invalid_crenedtials_text);
    await page.waitForTimeout(1500)
    await expect(loginPage.userName).toBeVisible();
});


/* 
test.describe() is used to group related tests together.
In this case, we are grouping all "Invalid Login" tests.
The `tag` helps categorize the test, e.g., for filtering or reporting.
The `annotation` provides additional metadata, like linking to the related user story 
*/
test.describe("Invalid Login Tests", {
    tag: "@InvalidLogin",
    annotation: {
        type: 'Story Link',
        description: 'paste link of user story here'
    }
}, () => {

    test('[Login] Verify that the user cannot log in with an invalid username.', {
        tag: ['@ui', '@uat'],
        annotation: {
            type: 'Test Case Link',
            description: 'paste Jira link or something here'
        }
    }, async ({ gotoURL, loginPage, commonUtils, page }) => {
        const password = commonUtils.decryptedData(process.env.PASSWORD!);
        await loginPage.login(loginModuleData.wrong_username, password);
        await expect(loginPage.invalidCredentialErrorPopup).toHaveText(loginModuleData.invalid_crenedtials_text);
        await page.waitForTimeout(1500)
        await expect(loginPage.userName).toBeVisible();
    });

    test('[Login] Verify that the user cannot log in with both an invalid username and password.', {
        tag: ['@ui', '@dev'],
        annotation: {
            type: 'Test Case Link',
            description: 'paste Jira link or something here'
        }
    }, async ({ gotoURL, loginPage, page }) => {
        await loginPage.login(loginModuleData.wrong_username, loginModuleData.wrong_password);
        await expect(loginPage.invalidCredentialErrorPopup).toHaveText(loginModuleData.invalid_crenedtials_text);
        await page.waitForTimeout(1500)
        await expect(loginPage.userName).toBeVisible();
    });
})


/*
toHaveScreenshot():
Captures a screenshot of the specified locator and saves it in the project.
On the first test run, the snapshot does not exist yet, so the test fails with an error like:

Error: A snapshot doesn't exist at 
C:\Users\Dell\OneDrive\Desktop\Playwright\PlayWright_With_TS_2\tests\login-module.spec.ts-snapshots\OrangeHrmBrandLogo-chromium-win32.png, writing actual.

However, the actual screenshot is saved in the snapshot folder. 
On subsequent runs, the test compares the current screenshot with the saved one and passes if they match.
This is useful for visual regression testing to detect unexpected UI changes.
*/
test('[Login] Verify that the user can log in with valid username and password.', {
    tag: ['@visual', '@uat'],
    annotation: {
        type: 'Test Case Link',
        description: 'https://dev.azure.com/wishinfinite/WishInfinite/_workitems/edit/7/'
    }
}, async ({ gotoURL, loginPage, commonUtils, leftNavPage }) => {
    const username = commonUtils.decryptedData(process.env.USER_NAME!);
    const password = commonUtils.decryptedData(process.env.PASSWORD!);
    await loginPage.login(username, password);

    await expect(leftNavPage.orangeHrmLogo).toHaveScreenshot('OrangeHrmBrandLogo.png');
    await expect(leftNavPage.leftNavPanel).toHaveScreenshot('LeftNavPanel.png')
})

