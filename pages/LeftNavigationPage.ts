import { Locator, Page } from "@playwright/test"


export class LeftNavigationPage {

    readonly page: Page
    readonly pimBtn: Locator
    readonly orangeHrmLogo: Locator
    readonly leftNavPanel: Locator

    constructor(page: Page) {
        this.page = page
        this.pimBtn = page.getByRole('link', { name: 'PIM' })
        this.orangeHrmLogo = page.getByRole('link', {name: 'PIM'})
        this.leftNavPanel = page.locator('div.oxd-sidepanel-body')
    }

    async openPIMLink() {
        await this.pimBtn.click()
    }
}
