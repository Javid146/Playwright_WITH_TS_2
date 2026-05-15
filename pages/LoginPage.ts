import { Locator, Page } from "@playwright/test";

export class LoginPage {

    readonly page: Page
    readonly userName: Locator
    readonly password: Locator
    readonly loginBtn: Locator
    readonly invalidCredentialErrorPopup: Locator
    readonly userDropdown: Locator
    readonly logoutBtn: Locator

    constructor(page: Page) {

        this.page = page
        this.userName = page.getByRole('textbox', { name: 'Username' })
        this.password = page.getByRole('textbox', { name: 'Password' })
        this.loginBtn = page.getByRole('button', { name: 'Login' })
        this.invalidCredentialErrorPopup = page.getByRole("alert")
        this.userDropdown = page.locator("li.oxd-userdropdown")
        this.logoutBtn = page.getByRole("link", {name: 'Logout'})
    }

    async goToOrangeHRm() {
        await this.page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
    }

    async login(userN: string, pwd: string) {
        await this.userName.fill(userN)
        await this.password.fill(pwd)
        await this.loginBtn.click()
    }

    async logOutOfApp() {
        await this.userDropdown.click()
        await this.logoutBtn.click()
    }
}

