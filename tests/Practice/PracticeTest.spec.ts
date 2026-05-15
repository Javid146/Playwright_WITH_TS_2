import { test } from './PracticeHook'
import { expect } from '@playwright/test'
test('first test',
    {
        tag: '@firstTag'
    }, async ({ goToHrm, page, practicePage, logOutHrm, practiceCommonUtil }) => {

        // const username = practiceCommonUtil.decryptData(process.env.USER_NAME!)
        // const pwd = practiceCommonUtil.decryptData(process.env.PASSWORD!)

        // await practicePage.loginToHrm(username, pwd)
        await expect(practicePage.pageHeaderElement).toBeVisible()
        const leftNavBtnName = "PIM"
        await practicePage.searchForLeftNavOption(leftNavBtnName)
        await expect(practicePage.pageHeaderElement).toHaveText(leftNavBtnName)
        await page.waitForTimeout(2000)
        await practicePage.selectFromSubUnitDropdown("Sub Unit", "Administration")
        await expect(practicePage.getDropdownSelectedOption("Sub Unit", "Administration")).toBeVisible()
        await expect(practicePage.getSearchBtnInPim()).toHaveClass("oxd-button oxd-button--medium oxd-button--secondary orangehrm-left-space")
        await expect(practicePage.getSearchBtnInPim()).toContainClass("oxd-button")
        await expect(practicePage.getSearchBtnInPim()).toHaveCSS("background-color", "rgb(118, 188, 33)")
        await expect(practicePage.getSearchBtnInPim()).toHaveAttribute("type", "submit")
        /*
        sources for toHaveAccessibleName():
        visible text  -> works for toHaveText() too. 
        aria-label
        aria-labelledby
        alt (for images)
    
        1. If aria-label or aria-labelledby exists → they override visible text
    
        <button aria-label="Submit Form">Search</button>
        await expect(button).toHaveAccessibleName('Search') ❌ FAIL
        await expect(button).toHaveAccessibleName('Submit Form') ✅ PASS
    
        2. <img src="x.png" alt="User Avatar">
        await expect(img).toHaveAccessibleName('User Avatar') ✅
    
        3. toHaveAccessibleName() → depends on accessibility rules (may ignore hidden elements)
        <button style="display:none">Search</button> -> toHaveAccessibleName() would fail
        toHaveText('Search') → still reads DOM text
        */
        await expect(practicePage.getSidePanelLocator()).toHaveAccessibleName("Sidepanel")
        const searchCount = await practicePage.getTotalSearchTextLocator().count()
        await expect(searchCount).toBeGreaterThanOrEqual(1)
        await expect(practicePage.getTotalSearchTextLocator()).toHaveCount(1) //how many elements with same locator
        /*
        Falsy values:               Truthy values:
        false                       true
        0                           number ≠ 0 
        '' (empty string)           non-empty string "abc"
        null                        object {}
        undefined                   array []
        NaN
        */
        // await expect(practicePage.getDropdownSelectedOption("Sub Unit", "Administration")).toBeFalsy()
        await expect(practicePage.getDropdownSelectedOption("Sub Unit", "Administration")).toBeTruthy()

        await practicePage.searchInput.fill("cucu")
        await expect(practicePage.searchInput).toHaveValue("cucu")

        //js properties: checked, disabled, hidden, value (from input)
        await expect(practicePage.searchInput).toHaveJSProperty("value", "cucu")
    })