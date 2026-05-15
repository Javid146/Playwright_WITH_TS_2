import { test } from '@playwright/test'

test('clicks', async ({ page }) => {

    // Generic click
    await page.getByRole('button').click();

    // Double click
    await page.getByText('Item').dblclick();

    // Right click
    await page.getByText('Item').click({ button: 'right' });

    // Shift + click. if ui supports this selects/highlights items on ui. 
    await page.getByText('Item').click({ modifiers: ['Shift'] });

    //CTRL + click -> if If element is a link (<a href="...">) -> browser default behavior = open in new tab. else nothing happens
    await page.getByText('Item').click({ modifiers: ['ControlOrMeta'] });

    // Hover over element
    await page.getByText('Item').hover();

    // Click the top left corner
    await page.getByText('Item').click({ position: { x: 0, y: 0 } });
})


test('keys', async ({ page }) => {

    // Hit Enter
    await page.getByText('Submit').press('Enter');

    // Dispatch Control+Right
    await page.getByRole('textbox').press('Control+ArrowRight');

    // Press $ sign on keyboard
    await page.getByRole('textbox').press('$');

    /*
    other keys to press like'$' above:
    Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape,
    ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight,
    ArrowUp, F1 - F12, Digit0 - Digit9, KeyA - KeyZ, etc.
    */

    //type capital A
    await page.locator('#name').press('Shift+A');

    //Moves cursor left holding shift to select text
    await page.locator('#name').press('Shift+ArrowLeft');

    //Moves cursor forward by 1 work not letter
    await page.getByRole('textbox').press('Control+ArrowRight');
})


test('scroll', async ({ page }) => {

    //playwright automatically scrolls to elements. but if extra manual scroll needed
    await page.getByText('Footer text').scrollIntoViewIfNeeded();

    // Position the mouse and scroll with the mouse wheel
    await page.getByTestId('scrolling-container').hover();
    await page.mouse.wheel(0, 10);

    // Alternatively, programmatically scroll a specific element -> scrollTop=0. scrolls 100 pixels down from current locator.
    await page.getByTestId('scrolling-container').evaluate(e => e.scrollTop += 100);
    //scrolls 100 pixels up from current locator
    await page.getByTestId('scrolling-container').evaluate(e => e.scrollTop -= 100);

    //scrolls left
    await page.getByTestId('scrolling-container').evaluate(e => e.scrollLeft += 100);
    //scrolls right
    await page.getByTestId('scrolling-container').evaluate(e => e.scrollLeft -= 100);

    //scrolls bottom 
    await page.getByTestId('scrolling-container').evaluate(e => { e.scrollTop = e.scrollHeight; }); //scrollHeight=total vertical content size
    //scrolls top
    await page.getByTestId('scrolling-container').evaluate(e => { e.scrollTop = 0; });

    //scrolls to right end
    await page.getByTestId('scrolling-container').evaluate(e => { e.scrollLeft = e.scrollWidth; }); //scrollWidth=total horizontal content size
    await page.getByTestId('scrolling-container').evaluate(e => { e.scrollTo(e.scrollWidth, 0) }); //alternative scroll to right end 

    //scrolls to left end
    await page.getByTestId('scrolling-container').evaluate(e => { e.scrollLeft = 0; });
    await page.getByTestId('scrolling-container').evaluate(e => { e.scrollTo(0, 0) }); //alternative scroll to left end 
})


test('drag and drop', async ({ page }) => {
    //1.
    await page.locator('#item-to-be-dragged').dragTo(page.locator('#item-to-drop-at'));

    //2. drag manually
    await page.locator('#item-to-be-dragged').hover();
    await page.mouse.down();
    await page.locator('#item-to-drop-at').hover();
    await page.mouse.up();
})