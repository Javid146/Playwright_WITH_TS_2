import { Locator, Page } from "@playwright/test";


export class UserPage {

    readonly page: Page
    readonly userDropdown: Locator
    readonly logout: Locator

    constructor(page) {

        this.page = page
        this.userDropdown = page.locator(".oxd-userdropdown-tab")
        this.logout = page.getByRole('menuitem', {name: 'Logout'})
    }

    async logoutUser() {
        await this.userDropdown.click()
        await this.logout.click()
    }
}