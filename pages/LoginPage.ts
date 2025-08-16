import { Locator, Page } from "@playwright/test";


export class LoginPage{

    readonly page: Page
    readonly userName: Locator
    readonly password: Locator
    readonly loginBtn: Locator
    readonly invalidCredentialErrorPopup: Locator

    constructor(page:Page){

        this.page = page
        this.userName = page.getByRole('textbox', { name: 'Username' })
        this.password = page.getByRole('textbox', { name: 'Password' })
        this.loginBtn = page.getByRole('button', { name: 'Login' })
        this.invalidCredentialErrorPopup = page.getByRole("alert")
    }

    async goToOrangeHRm(){
        await this.page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
    }

    async login(userN:string, pwd:string) {
        await this.userName.fill(userN)
        await this.password.fill(pwd)
        await this.loginBtn.click()
    }
}




// import { Locator, Page } from "@playwright/test";


// export class LoginPage{

//     readonly page: Page
//     readonly userName: Locator
//     readonly password: Locator
//     readonly loginBtn: Locator

//     constructor(page:Page){

//         this.page = page
//         this.userName = page.getByRole('textbox', { name: 'Username' })
//         this.password = page.getByRole('textbox', { name: 'Password' })
//         this.loginBtn = page.getByRole('button', { name: 'Login' })
//     }

//     async goToOrangeHRm(){
//         await this.page.goto(`${process.env.BASE_URL}L/web/index.php/auth/login")
//     }

//     async login(userN:string, pwd:string) {
//         await this.userName.fill(userN)
//         await this.password.fill(pwd)
//         await this.loginBtn.click()
//     }
// }