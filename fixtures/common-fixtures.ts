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
    commonUtils: async ({ }, use) => {
        await use(new CommonUtils())
    },
    commonApiUtils: async ({ request }, use) => {
        await use(new CommonApiUtils(request))
    },
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