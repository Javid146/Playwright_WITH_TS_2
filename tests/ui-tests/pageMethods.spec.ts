import { test, expect } from '@playwright/test';

test('page.on() vs page.once()', async ({ page }) => {
    /*
     * on() and once() are methods inherited from Node.js EventEmitter.
     * Playwright objects such as Page, Browser, BrowserContext, Request, etc.
     * are event emitters.
     *
     * Common events:
     *   'load'        -> page finished loading
     *   'dialog'      -> alert/confirm/prompt appeared
     *   'download'    -> file download started
     *   'request'     -> network request sent
     *   'response'    -> network response received
   
     * page.on('load', handler)
     *
     * - Registers a persistent event listener.
     * - Fires EVERY time the page emits the 'load' event.
     * - Stays active until removed manually with:
     *     page.removeListener('load', handler)
     * 
     * page.once('load', handler)
     * - Registers a one-time event listener.
     * - Fires ONLY the next time the 'load' event occurs.
     * - Automatically removes itself afterward.
     * - No need to call removeListener().
     */
    page.on('load', () => {
        console.log('page.on -> fired on every load');
    });

    page.once('load', () => {
        console.log('page.once -> fired only once');
    });

    // First page load:
    // Output:
    //   page.on -> fired on every load
    //   page.once -> fired only once
    await page.goto('https://example.com');

    // Second page load:
    // Output:
    //   page.on -> fired on every load
    //   (page.once does not fire anymore)
    await page.reload();
});


test('locator handler with times and noWaitAfter', async ({ page }) => {
    /*
     * We register a locator handler that will trigger ONLY ONCE (times: 1)
     * when the "Cookie banner" appears.
     *
     * This is useful when:
     * - popup appears only on first visit
     * - we don't want to repeatedly handle it
     * if (times: 1) is not added handler will handle "Cookie banner" each time it appears
     */
    await page.addLocatorHandler(
        page.getByText('Cookie banner'),
        async () => {
            await page.getByRole('button', { name: 'Accept cookies' }).click();
        },
        {
            times: 1, // run this handler only once
            //After running the handler, Playwright should NOT wait for the triggered locator to become hidden. used when popups stay on page after handled and not disapper
            //otherwise test might wait for disappearance and fail
            //don't use it if popup needs to disappear before test resumes
            noWaitAfter: true
        }
    );

    //Navigate to the page. If cookie banner appears, handler will auto-run during actions below.
    await page.goto('https://example.com');

    /*
     * Normal test action.
     * If overlay appears, Playwright will:
     * 1. detect locator ("Cookie banner")
     * 2. run handler once
     * 3. continue click immediately (no waiting due to noWaitAfter)
     */
    await page.getByRole('button', { name: 'Start' }).click();

    //Handler will NOT run again because times: 1 was reached.
    await expect(page).toHaveURL(/example/);
});


test('multi-page interaction with bringToFront example', async ({ context }) => {
    /**
     * Create two independent browser tabs (pages) within the same context.
     * Each page is fully isolated but controlled from the same test.
     */
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    /**
     * Navigate both pages independently.
     * Playwright does NOT require switching tabs for navigation or actions like in selenium.
     */
    await page1.goto('https://a.com');
    await page2.goto('https://b.com');

    /**
     * Interact with page2 directly.
     * This works even if page2 is NOT the active/visible tab.
     * No need for bringToFront() for functional automation.
     */
    await page2.click('button');

    /**
     * Bring page2 to the front (visual action only).
     * This is useful for:
     * - debugging in headed mode
     * - seeing what the test is doing
     * - video recording clarity
     *
     * It does NOT affect Playwright’s ability to interact with pages.
     */
    await page2.bringToFront();

    /**
     * Continue interacting after switching focus visually.
     * Again, focus is not required for Playwright actions to work.
     */
    await page2.click('button');

    /**
     * You can still interact with page1 independently.
     * No switching back is required for functionality.
     */
    await page1.click('input');
});


test('highlight and hideHighlight example', async ({ page }) => {

    await page.goto('https://example.com');

    /**
     * Highlight a locator.
     * This draws a visible overlay around the matched element
     * (useful for debugging selector correctness).
     */
    await page.getByRole('heading').highlight();

    /**
     * Hide all locator highlights added by .highlight()
     * This removes visual debug overlays from the page.
     */
    await page.hideHighlight();
    //continue normal testing
    await page.click('body');
});


/**
 * page.evaluate() runs JavaScript directly inside the browser context (not Node.js).
 *
 * It is useful when you need to:
 * - Access browser-only APIs (window, document, localStorage, sessionStorage)
 * - Read or modify global page state
 * - Execute custom logic that Playwright does not provide as an API
 *
 * It is NOT needed for normal test actions like clicking, typing, or reading text,
 * because Playwright locators already handle that in a safer and more stable way.
 *
 * locator.evaluate() is similar, but scoped to a single element instead of the whole page.
 */
test('page.evaluate - global DOM change', async ({ page }) => {
    await page.goto('https://example.com');

    /**
     * below example changes the ENTIRE page background -> global level change during test
     */
    await page.evaluate(() => {
        document.body.style.background = 'red';
    });
});


test('locator.evaluate - element level change', async ({ page }) => {
    await page.goto('https://example.com');

    /**
     * This targets ONLY the heading element and modifies it safely. locator level
     */
    await page.locator('h1').evaluate(el => {
        el.style.color = 'blue';
        el.style.fontSize = '40px';
    });
});


test('page.evaluate - localStorage', async ({ page }) => {
    await page.goto('https://example.com');

    /**
     * Direct browser storage manipulation
     */
    await page.evaluate(() => {
        localStorage.setItem('token', 'abc123');
    });

    const token = await page.evaluate(() => {
        return localStorage.getItem('token');
    });

    console.log(token);
});


/*
 * waitForFunction vs await (important concept)
 *
 * 1) await
 * - "await" is used for Promises that are already defined as async operations.
 * - It waits for ONE specific operation to finish (e.g. page.goto, click, API call).
 *
 * Example:
 *   await page.goto(url); // waits until navigation is done
 *
 * 2) page.waitForFunction
 * - This is NOT just waiting for a promise to finish.
 * - It repeatedly runs a function INSIDE the browser context until it returns true.
 * - It is used for CONDITIONS, not actions.
 *
 * Example:
 *   await page.waitForFunction(() => window.innerWidth < 500);
 *   → keeps checking browser state until condition becomes true
 *
 * Key difference:
 * - await = wait for an async task to finish
 * - waitForFunction = keep polling until a condition becomes true
 *
 * When to use waitForFunction:
 * - waiting for UI state changes (DOM updates, text appears, variable changes)
 * - when there is no direct Playwright locator/event to wait for
 *
 * Better alternatives (preferred in real tests):
 * - expect(locator).toBeVisible()
 * - locator.waitFor()
 * - page.waitForSelector()
 */
test('waitForFunction - different real-world use cases', async ({ page }) => {

    await page.goto('https://example.com');

    //1.
    //By default, page.waitForFunction() waits up to 30 seconds, with timeout can override
    await page.waitForFunction(() => {
        // Wait until an element with text "Welcome" exists in the DOM
        return document.body.textContent?.includes('Welcome');
    }, { timeout: 5000 });

    // Now the app has finished loading user data
    await expect(page.getByText('Welcome')).toBeVisible();


    //2.
    //Waiting for viewport. watch creates a Promise immediately, but you do not await it yet.
    const watch = page.waitForFunction(() => window.innerWidth < 500);

    await page.setViewportSize({ width: 400, height: 800 });

    //wait for watch promise to fullfil 
    await watch;
    console.log('Viewport condition met');


    //3.
    //Keep checking 5 secs whether document.title === 'Ready'
    await page.waitForFunction(
        () => document.title === 'Ready',
        { timeout: 5000 } // fails if condition not met in 5s
    );
});


test('page close event example', async ({ page }) => {

    // Listen for when the TAB is closed. page.on('close') is event listener
    page.on('close', () => {
        console.log('Page was CLOSED (tab destroyed)');
    });

    await page.goto('https://example.com');

    // This does NOT change page, it destroys the tab
    await page.close();
});


test('wait for page close', async ({ context, browser }) => {

    const page = await context.newPage();
    await page.goto('https://example.com');

    // Start waiting BEFORE closing. page.waitForEvent('close') is promise
    const closePromise = page.waitForEvent('close');

    //browser=e.g chrome; page=tab; context=incognito profile / separate session
    await page.close(); //closes the tab
    await context.close(); //all pages inside are closed → triggers close
    await browser.close(); //Everything closes (contexts + pages + browser itself) → triggers close

    await closePromise; // resolves when page is actually closed
    console.log('Confirmed: page is closed');
});


test('popup (new tab) example', async ({ page }) => {

    await page.goto('https://example.com');

    /**
     * POPUP = NEW TAB EVENT 
     * This is NOT a UI dialog like alert()/confirm(). It is a real browser tab/window.
     * This starts listening BEFORE the popup is created.
     * It will catch the next new tab/window opened by this page.
     */
    const popupPromise = page.waitForEvent('popup');

    /**
     * This action triggers window.open() or target="_blank"
     * which opens a NEW TAB (popup)
     */
    await page.click('text=Open new tab');

    /**
     * This resolves when the new tab is created.
     * popup is now a FULL Page object (like "page")
     */
    const popup = await popupPromise;
    await popup.waitForLoadState();
    console.log('Popup URL:', await popup.url());
    await popup.click('text=Login');
});