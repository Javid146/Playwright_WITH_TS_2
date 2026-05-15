import { Locator, Page } from '@playwright/test'

export class
    PracticePage {

    readonly page: Page
    readonly userInput: Locator
    readonly pwdInput: Locator
    readonly pageHeader: Locator
    readonly userDropdown: Locator
    readonly searchInput: Locator

    constructor(page: Page) {
        this.page = page
        this.userInput = page.getByRole("textbox", { name: "username" })
        this.pwdInput = page.getByRole("textbox", { name: "password" })
        this.pageHeader = page.getByRole("heading", { level: 6 })
        this.userDropdown = page.locator(".oxd-userdropdown-tab")
        this.searchInput = page.getByPlaceholder("Search")
    }

    async goToHrm() {
        await this.page.goto(process.env.BASE_URL!)
    }

    async loginToHrm(username: string, pwd: string) {
        await this.userInput.fill(username)
        await this.pwdInput.fill(pwd)
        await this.pwdInput.press('Enter')
    }

    async logOutHrm() {
        const logoutBtn = this.page.getByRole('menuitem', { name: 'Logout' }) //Playwright locators are lazy and auto-waiting. 
        // so even if element is not displayed there won't be error like in selenium
        await this.userDropdown.click()
        await logoutBtn.waitFor({ state: 'visible' });
        await logoutBtn.click()
    }

    get pageHeaderElement() {
        return this.pageHeader
    }

    async searchForLeftNavOption(optionName: string) {

        /*
        All locators below are valid.
        - hasText matches text inside the element AND all its descendants (children, nested elements, etc.)
        - So it works even if the visible text is inside a child tag like <span>
        These locators find <a> elements where the visible text (direct or nested) matches optionName
        */

        const leftNavLocator = this.page.getByRole("link", { name: optionName })
        // const leftNavLocator = this.page.locator("a", { hasText: optionName })
        // const leftNavLocator = this.page.locator("a").filter({ hasText: optionName })
        await this.searchInput.fill(optionName)
        await leftNavLocator.click()
    }

    async selectFromSubUnitDropdown(dropdownLabel: string, option: string) {

        const dropdown = this.page.locator('label', { hasText: dropdownLabel }) //find label
            .locator('xpath=ancestor::div[contains(@class,"oxd-input-group")]') //go to its ancestor/parent
            .locator('.oxd-select-text') //find child

        dropdown.waitFor({ state: 'visible' })
        /*
        const dropdown = page.locator('label', { hasText: 'Sub Unit' }) //find label
                             .locator('..') //go to its direct parent
                             .locator('.oxd-select-text') //find child
        */

        await dropdown.click()

        const optionLocator = this.page.getByRole("option", { name: option })
        await optionLocator.click()
    }

    getDropdownSelectedOption(dropdownLabel: string, option: string) {

        const locator = this.page
            .locator('label', { hasText: dropdownLabel })
            .locator("xpath=ancestor::div[contains(@class,'oxd-input-group')]")
            .getByText(option)

        return locator
    }

    getSearchBtnInPim() {
        /*
        getByRole({ name }) text priority: 
        1. aria-labelledby → 2. aria-label → 3. visible text → 4. alt (for images) 
        If any of these exists in element, it becomes priority over visible text (Search). 
        Because getByRole({ name }) behaves like toHaveAccessibleName().

        searchBtn locator would fail if its element was like:
        case 1:
        <button aria-label="Submit Form">Search</button>
        page.getByRole('button', { name: 'Search' }) ❌ FAIL
        page.getByRole('button', { name: 'Submit Form' }) ✅ PASS

        case 2:
        <span id="lbl">Submit Form</span>
        <button aria-labelledby="lbl">Search</button>
        page.getByRole('button', { name: 'Search' }) ❌ FAIL
        page.getByRole('button', { name: 'Submit Form' }) ✅ PASS

        case 3:
        <img alt="User Avatar" />
        page.getByRole('img', { name: 'User Avatar' }) ✅

        But for a button alt is ignored:
        <button alt="Submit">Search</button>
        page.getByRole('button', { name: 'Search' }) ✅ still works

        searchBtn locator works because its element does not have aria-label but only visible text.
        <button data-v-10d463b7="" data-v-7044e35a="" type="submit" class="oxd-button">Search</button>
        */
        const searchBtn = this.page.getByRole("button", { name: "Search" })
        return searchBtn
    }

    getSidePanelLocator() {
        return this.page.getByRole("navigation", { name: "Sidepanel" })
    }

    getTotalSearchTextLocator() {
        return this.page.getByText("Search")
    }
}

/*
getByRole() Role Mapping:

HTML	    Role
<header>	banner 👉 <header> becomes role="banner" <header> becomes role="banner" only if it is a top-level header for the page
That means: It’s not inside <section>, <article>, <main>, <nav>, <aside>, etc.
<body><header>Main Header</header> </body>
page.getByRole('banner') 
If <header> is inside another section:
<div>
  <header>Section Header</header> <!-- ❌ NOT banner -->
</div>
page.getByRole('banner') // ❌ won't find this
page.getByText('Section Header')
page.locator('div header').getByText('Section Header')

<main>		main

<footer>	contentinfo
<footer>© 2026 Company</footer>
page.getByRole('contentinfo')
page.locator('footer', { hasText: 'Company' })  //hasText behaves like contains
page.getByRole('contentinfo').filter({ hasText: 'Company' })

<nav>		navigation

<section>	region (if labeled)
<section>
  <header>Section Header</header> <!-- ❌ NOT banner -->
</section>
page.getByRole('banner') // ❌ won't find this
page.getByText('Section Header')
const section = page.locator('section')
section.getByText('Section Header')

<h1>–<h6>	heading
page.getByRole('heading', { level: 1 }) h1
page.getByRole('heading', { level: 2 }) h2

<ul>		list
<ol>		list
<li>		listitem
page.locator('li', { hasText: 'PIM' })
page.locator('li').nth(0)
page.locator('li').first()
page.locator('li').last()

<table>		    table
<tr>		    row
<td>		    cell
<table>
  <tr>
    <th>Name</th>
    <th>Age</th>
  </tr>
  <tr>
    <td>John</td>
    <td>25</td>
  </tr>
</table>
page.getByRole('table')
page.getByRole('row')
page.getByRole('cell')
page.getByRole('cell', { name: 'John' })   👉 Finds the <td> that contains “John”
page.getByRole('row', { name: 'John 25' }) 👉 The “name” of a row is basically all text inside it combined
🔹 Combine row + cell (very useful)
const row = page.getByRole('row', { name: 'John' })
await expect(row.getByRole('cell', { name: '25' })).toBeVisible()
page.getByRole('columnheader', { name: 'Name' }) 👉 <th> → role = columnheader

<p>		    paragraph (rarely used in testing)

<button>	button
page.getByRole('button', { name: 'Login' })
page.getByRole('button', { name: 'Login', exact: true })
page.getByRole('button', { pressed: true })
page.getByRole('button', { expanded: true })
page.getByRole('button', { name: 'Save', includeHidden: true })

<a>		        link
<dialog>	    dialog
role="alert"	alert

<input type="text">	textbox
page.getByRole('textbox').filter({ hasText: 'Username' }) ❌ Won’t work for <input>
Because <input> has no visible text node
<input type="text" placeholder="Username" />
page.getByPlaceholder('Username')

<textarea>		textbox
<textarea>Enter your message</textarea>
page.getByRole('textbox').filter({ hasText: 'Enter your message' })
<textarea placeholder="Message"></textarea>
page.getByPlaceholder('Message')

<input type="password">	textbox
page.getByRole('textbox') // only if it's the only one
<label>Password</label>
<input type="password"/>
page.getByRole('textbox', { name: 'Password' })

<input type="checkbox">	checkbox
<input type="checkbox" />
page.getByRole('checkbox')
page.getByRole('checkbox').nth(0)
page.locator('input\[type="checkbox"]')

<input type="radio">	radio
<input type="text" placeholder="Username" />

<select>		combobox //means dropdown
<select><option>India</option></select>
page.getByRole('combobox') 
page.getByRole('combobox').selectOption('India');
page.locator('select').selectOption('India'); works too
page.getByRole('combobox', { name: 'Country' }).selectOption('India'); //specify if many dropdowns exist
*/