import { Locator, Page } from "@playwright/test"


export class PIMPage {

    readonly page: Page
    readonly addBtn: Locator
    readonly frstNameInput: Locator
    readonly lstNameInput: Locator
    readonly saveBtn: Locator
    readonly newEmployeeHeading: Locator

    constructor(page: Page) {
        this.page = page
        this.addBtn = page.getByRole('button', { name: ' Add ' })
        this.frstNameInput = page.getByRole('textbox', { name: 'First Name' })
        this.lstNameInput = page.getByRole('textbox', { name: 'Last Name' })
        this.saveBtn = page.getByRole('button', { name: 'Save' })
        this.newEmployeeHeading=page.locator(".orangehrm-edit-employee-name h6")
    }

    async addEmployee() {
        await this.addBtn.click()
    }

    async createNewEmployee(firstN: string, lastN: string) {
        await this.frstNameInput.fill(firstN)
        await this.lstNameInput.fill(lastN)
        await this.saveBtn.click()
    }
}
