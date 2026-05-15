import { test as base } from './PracticeCommonFixture'

type hookFix = {

    goToHrm: void,
    logOutHrm: void //means it returns nothing. any means it does not care about type. so ts disables type check 
}


export const test = base.extend<hookFix>({

    goToHrm: async ({ practicePage }, use) => {
        await practicePage.goToHrm()
        await use()
    },

    logOutHrm: async ({ practicePage }, use) => {
        await use()
        await practicePage.logOutHrm()
    }
})

export { expect } from '@playwright/test'
//or just re-export after importing above: export {expect}