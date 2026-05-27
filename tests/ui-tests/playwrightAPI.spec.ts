import { test, expect } from '@playwright/test'

test.describe('orange tests', async () => {

    test.beforeEach('login to hrm', async ({ page }) => {

        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
        await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
        await page.getByRole('button', { name: 'Login' }).click();
    })

    test('innerText/textContent', async ({ page }) => {

        const locator = page.locator(".orangehrm-attendance-card-profile-record")
        const allInnerTexts = await locator.allInnerTexts() // returns visible (inner) text of each matched element (including all its descendants), respects css
        //e.g. allInnerTexts -> Punched In: Today at 08:00 AM (GMT -7)
        console.log("allInnerTexts: " + allInnerTexts)

        const innerText = await locator.innerText() //visible text (what user sees)
        const textContent = locator.textContent() //all text in DOM (including hidden)
        console.log("innerText: " + innerText)

        await expect(locator.locator("p").nth(0)).toContainText("Punched", { useInnerText: true })
        // or await expect(locator.locator("p").first()).toHaveText("Punched Out", { useInnerText: true })

        const locator2 = page.locator(".oxd-grid-3.orangehrm-quick-launch")
        const allTextContents = await locator2.allTextContents() //returns all visible inner text, also hidden hidden text, does not respect css, faster than allInnerTexts
        //e.g. allTextContents -> Assign LeaveLeave ListTimesheetsApply LeaveMy LeaveMy Timesheet
        console.log("allTextContents:" + allTextContents)
    })


    test('inner/outerHtml()', async ({ page }) => {

        /*
        <div id="box">
            <span>Hello</span>
            <button>Click</button>
        </div>
    
        1. innerHtml() -> content inside the element
        returns:
        <span>Hello</span>
        <button>Click</button>
    
        2. outerHTML() -> whole element including its own tags
        returns:
        <div id="box">
            <span>Hello</span>
            <button>Click</button>
        </div>
        */
        const locator = page.locator('#box');
        const innerHtml = await locator.innerHTML({ timeout: 5000 });
        console.log(innerHtml)
        expect(innerHtml).toContain('<span>Hello</span>');

        const outerHtml = await locator.evaluate(el => el.outerHTML); //outerHTML can be achieved via evaluate only. 
        console.log(outerHtml)
        //innerHtml, outerHtml do not contain the CSS selector string #box. so expect(outerHtml).toContain('#box'); would fail
        // they contain actual HTML markup
        expect(outerHtml).toContain('id="box"');
        expect(outerHtml).toContain('<div id="box">');
        expect(outerHtml).toContain('<span>Hello</span>');
    })


    test('and/or combination', async ({ page }) => {
        //and
        const andLocator = page.getByRole("button").and(page.getByTitle("Help")) //finds locator that has both attributes
        await expect(andLocator).toBeVisible()

        //or
        const newEmail = page.getByRole('button', { name: 'New' });
        const dialog = page.getByText('Confirm security settings');

        //playwright for either locator to be available to interact. great when page is not consistent with next element
        //sometimes both elements can appear at same time. in that case we use first() to only match one of them
        await expect(newEmail.or(dialog).first()).toBeVisible();
        if (await dialog.isVisible()) {
            await page.getByRole('button', { name: 'Dismiss' }).click(); //if dialog exists dismiss it
        }
        await newEmail.click();
    })
})


test('frame - practice all methods', async ({ page }) => {

    await page.goto("https://vinothqaacademy.com/iframe/")

    // 1️⃣ Locate iframe using getByTitle (page locator)
    const iframeElement = page.getByTitle("Web Table")

    // 2️⃣ Convert to Frame using contentFrame()
    const frame = iframeElement.contentFrame()

    // 3️⃣ Assert iframe element exists (Locator assertion)
    await expect(iframeElement).toBeVisible()

    // 4️⃣ Work inside iframe using Frame API
    if (frame) {
        await frame.getByRole("button", { name: "Add Row" }).click()
    }

    // 5️⃣ Alternative approach: FrameLocator (recommended way)
    const frameLocator = page.frameLocator('iframe[title="Web Table"]')
    await frameLocator.getByRole("button", { name: "Add Row" }).click()

    // 6️⃣ Outside iframe assertion (normal page)
    await expect(page.getByText("Demo Sites – V Tech Solutions")).toContainText("Demo Sites")
})


test('shadow dom', async ({ page }) => {

    /*unless cypress playwright does not need any chaining mwthod to access dom.

    <x-details role=button aria-expanded=true aria-controls=inner-details>
    <div>Title</div>
    #shadow-root
    <div id=inner-details>Details</div>
    </x-details>
    */
    await page.locator('x-details', { hasText: 'Details' }).click();
    await expect(page.locator('x-details')).toContainText('Details');
})


test('locator describe', async ({ page }) => {

    //describe() the locator, description is used in the trace viewer and reports
    //description() returns previoulsy described locator 
    await page.goto("https://vinothqaacademy.com/iframe/")
    const frame = page.getByText("Demo Sites – V Tech Solutions").describe("page header")
    console.log(frame.description())
})


test('dispatchEvent', async ({ page }) => {
    //dispatchEvent() fires JavaScript events directly — it’s powerful, but bypasses real user behavior, so use it only when needed
    await page.locator('#btn').dispatchEvent('click');

    await page.locator('#input').fill('Hello');
    await page.locator('#input').dispatchEvent('change');

    await page.locator('#box').dispatchEvent('mouseover'); //similar to hover
    await page.locator('#box').hover();

    //drag-drop
    await page.locator("your locator").dispatchEvent('dragstart');
    await page.locator("your locator").dispatchEvent('drop');
    await page.locator("your locator").dragTo(page.locator("destination locator")) //better

    //scroll with wheel (scroll from locator). use when: 👉 is there a scrollable div?
    await page.locator('#container').dispatchEvent('wheel', { deltaY: 100 }); //down
    await page.locator('#container').dispatchEvent('wheel', { deltaY: -100 }); //up

    await page.mouse.wheel(0, 10); //Real mouse wheel input. Scrolls element currently under mouse pointer

    //regular scroll (scroll from locator). use when: 👉 is there a scrollable div?
    await page.locator("locator").evaluate(e => e.scrollTop += 200); // always down
    await page.locator("locator").evaluate(e => e.scrollTop -= 200); // always up
    await page.locator('#container').dispatchEvent('scroll'); //this does not scroll. it just notifies app. Because some apps depend on the event, not just position change

    //scroll whole page not just container (from lspecified locator). use when: 👉 does the page itself scroll?
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.locator("").scrollIntoViewIfNeeded() //recommended.
})


test('filter', async ({ page }) => {

    //filter narrows down searched locator. here: find locator that is in .card locator and has filtered features
    const rowLocator = page.locator(".card")
        .filter({ hasText: 'text in column 1' })
        .filter({ has: page.getByRole('button', { name: 'column 2 button' }) })

    const product = page.locator('.product')
        .filter({ hasNotText: 'iPhone' });

    await expect(page
        .getByRole('listitem')
        .filter({ has: page.getByRole('heading', { name: 'Product 2' }) }))
        .toHaveCount(1);

    //The filtering locator must be relative to the original locator and is queried starting with the original locator match, not the document root.
    // ✖ WRONG: because the filtering locator starts matching from the <ul> list element that is outside of the <li>
    await expect(page
        .getByRole('listitem')
        .filter({ has: page.getByRole('list').getByText('Product 2') }))
        .toHaveCount(1);

    //Consider a page with two buttons, the first invisible and the second visible. This will only find a second button, because it is visible, and then click it.
    await page.locator('button').filter({ visible: true }).click();
})


test('attr, css, property', async ({ page }) => {

    /*
    getAttribute() → HTML attribute (string or null)
    evaluate() → DOM properties + CSS access
    getComputedStyle() → CSS
    */
    const locator = page.locator('#username');

    await locator.getAttribute('type'); //returns string. <input type="text">, <input type="password">
    await expect(locator).toHaveText("text")
    await expect(locator).toHaveAttribute('placeholder', 'Enter name');
    await expect(await locator.getAttribute('aria-expanded')).toBe('true');

    const borderColor = await locator.evaluate(el => getComputedStyle(el).borderColor);
    expect(borderColor).toBe('rgb(255, 0, 0)');

    const locatorBorderColor = await locator.evaluate(el => getComputedStyle(el).borderColor); //computed style -> final, resolved style after CSS rules apply
    await expect(locatorBorderColor).toBeTruthy()
    await expect(locator).toHaveCSS('color', 'rgb(255, 0, 0)'); //better, auto-waits, flaky-safe, retries
})


test('press/pressSequentially', async ({ page }) => {

    await page.locator('#input').press('Enter');
    await page.press('#firstName', 'Tab'); //  jumps to second input like lastName

    //press ESC to close modal
    await page.press('body', 'Escape');

    //arrow keys
    await page.press('#dropdown', 'ArrowDown');
    await page.press('#dropdown', 'ArrowUp');

    //key combin.
    await page.press('#input', 'Control+A'); // select all
    await page.press('#input', 'Control+C'); // copy
    await page.press('#input2', 'Control+V'); // paste

    //single key click
    await page.press('#input', 'a');
    // await page.fill('#input', 'hello');  // faster for full typing

    //delete text
    await page.press('#input', 'Backspace'); // deletes leftward
    await page.press('#input', 'Delete');    // deletes rightward

    //type slow like a real user
    const locator = page.locator("")
    await locator.pressSequentially('World', { delay: 100 });
})


test('select', async ({ page }) => {

    //combobox means dropdown. 
    // selectOption() works only with native <select>, not custom div dropdowns.
    page.getByRole('combobox').selectOption('India'); // Works if there is a single <select> element with role "combobox".
    page.locator('select').selectOption('India'); //works too
    page.getByRole('combobox', { name: 'Country' }).selectOption('India'); //specify if many dropdowns exist
})


test('lists', async ({ page }) => {
    //count
    await expect(page.getByRole('listitem')).toHaveCount(3);

    /*
    assert all texts in list
    <ul>
    <li>apple</li>
    <li>banana</li>
    <li>orange</li>
    </ul>
    */
    await expect(page.getByRole('listitem')).toHaveText(['apple', 'banana', 'orange']);

    //Get a specific item
    await page.getByText('orange').click();
    //or with filter
    await page.getByRole('listitem').filter({ hasText: 'orange' }).click();

    //get nth()
    const banana = page.getByRole('listitem').nth(1);

    //iterate with all()
    for (const row of await page.getByRole('listitem').all())
        console.log(await row.textContent());

    //iterate with regular loop
    const rows = page.getByRole('listitem');
    const count = await rows.count();
    for (let i = 0; i < count; ++i)
        console.log(await rows.nth(i).textContent());
})