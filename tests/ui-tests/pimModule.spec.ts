import { test, expect } from "../../fixtures/hooks-fixture"
import pimModuleData from "../../test-data/ui-data/pimModule-data.json"

/*
ALL TESTS REQUIRE THE SECRET KEY.  
Set it in bash like: `SECRET_KEY=javid5`  

You can then run the tests using either:  
1. npm script from package.json, e.g.:  
   `SECRET_KEY=javid5 npm run uat_cr_hd`  
2. Direct Playwright command, e.g.:  
   `SECRET_KEY=javid5 playwright test login-module.spec.ts`
*/

//gotoURL goes to URL as beforeEach hook (in hooks-fixture.ts) even if not used in method 
test('[PIM] Verify that a new employee is successfully created under the PIM module.', {
    tag: ['@dev', '@uat'],
    annotation: { //annot is used for linked issue and test-related details like qtest
        type: 'Test Case Link',
        description: 'https://dev.azure.com/wishinfinite/WishInfinite/_workitems/edit/6/'
    }
}, async ({ gotoURL, leftNavPage, pimPage }) => {

    // test.step() is similar to report.info(). It is used to describe steps of test in report in human readable way
    await test.step('Open PIM Module', async () => {
        await leftNavPage.openPIMLink();
        await pimPage.addEmployee()
    });

    // Step 2: Add Employee in PIM Module
    await test.step('Add Employee in PIM Module', async () => {
        await pimPage.createNewEmployee(pimModuleData.firstName, pimModuleData.lastName);
        await expect(pimPage.newEmployeeHeading).toHaveText(`${pimModuleData.firstName} ${pimModuleData.lastName}`, { timeout: 20000 });
    });
});
