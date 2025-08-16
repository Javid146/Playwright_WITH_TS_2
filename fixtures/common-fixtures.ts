import { test as baseTest } from "../fixtures/pom-fixture"
import CommonUtils from "../utils/CommonUtils"

type myCommonFixtureType = {
    commonUtils: CommonUtils
}

export const test = baseTest.extend<myCommonFixtureType>({
    commonUtils: async ({}, use) => {
        use(new CommonUtils())
    }
})


/* 
   We use Playwright fixtures to avoid manually creating page class instances in every test.
   Fixtures instantiate the page classes once here, so tests can simply import `test` 
   and use the page objects directly.
*/
