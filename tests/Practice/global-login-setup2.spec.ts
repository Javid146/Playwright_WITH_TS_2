import { test } from './PracticeCommonFixture'
import { expect } from '@playwright/test'

test('global login', async ({ page, practicePage, practiceCommonUtil }) => {

    const username = practiceCommonUtil.decryptData(process.env.USER_NAME!)
    const pwd = practiceCommonUtil.decryptData(process.env.PASSWORD!)

    await practicePage.goToHrm()
    await practicePage.loginToHrm(username, pwd)

    await page.waitForURL(process.env.BASE_URL! + "/web/index.php/dashboard/index")
    await expect(practicePage.pageHeaderElement).toBeVisible()

    await page.context().storageState({
        path: './playwright/auth/practiceAuth.json'
    })
})
