import { test as baseTest } from "../fixtures/pom-fixture"
import CommonUtils from "../utils/CommonUtils"
import CommonApiUtils from "../utils/CommonApiUtils"

type myCommonFixtureType = {
    commonUtils: CommonUtils
    commonApiUtils: CommonApiUtils
}

/*
With <myCommonFixtureType> You are explicitly telling TypeScript: “These fixtures will exist and have these types”
commonUtils: CommonUtils
commonApiUtils: CommonApiUtils
👉 These are custom classes, not simple values.

🔍 When you can skip <Type>? If it’s simple:
export const test = baseTest.extend({ value: async (_, use) => { await use("hello"); }});
👉 TS infers "hello" → string
*/
export const test = baseTest.extend<myCommonFixtureType>({
    commonUtils: async ({}, use) => {
        use(new CommonUtils())
    },
    commonApiUtils: async ({request}, use) => {
        use(new CommonApiUtils(request))
    },
})


/* 
   We use Playwright fixtures to avoid manually creating page class instances in every test.
   Fixtures instantiate the page classes once here, so tests can simply import `test` 
   and use the page objects directly.
*/
