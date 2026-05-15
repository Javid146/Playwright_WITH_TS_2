import { PracticePage } from "./PracticePage";
import { test as base } from '@playwright/test'

type pomFixture = {

    practicePage: PracticePage
}

export const test = base.extend<pomFixture>({

    practicePage: async ({ page }, use) => {
        await use(new PracticePage(page))
    }
})