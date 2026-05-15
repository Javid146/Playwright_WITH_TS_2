import { test, expect } from '@playwright/test'

/*
by default dialog closes by itself. But if you use page.on('dialog') event then either accept() or dismiss() it.
console.log(dialog.message()) -> prints dialog text
*/
test('simple alert 1', async ({ page }) => {

    await page.goto('https://testautomationpractice.blogspot.com/');

    // register listener FIRST
    page.on('dialog', async dialog => {
        console.log(dialog.message());
        console.log(dialog.type()); //returns type of dialog -> alert

        expect(dialog.type()).toBe('alert')
        await page.waitForTimeout(2000); // keeps alert open for 2 sec
        await dialog.dismiss();
    });

    const simpleAlert = page.getByText('Simple Alert');
    await simpleAlert.scrollIntoViewIfNeeded();
    await simpleAlert.click();
    await page.waitForTimeout(3000);
});


test('confirmation alert', async ({ page }) => {

    await page.goto('https://testautomationpractice.blogspot.com/');

    page.on('dialog', async dialog => {
        console.log(dialog.message());
        console.log(dialog.type()); //returns type of dialog -> confirm

        expect(dialog.message()).toBe('Press a button!');
        await page.waitForTimeout(2000); // keeps alert open for 2 sec
        await dialog.dismiss(); //accept and dismiss is same here. 
    })

    const confirmationAlert = page.getByText('Confirmation Alert');
    await confirmationAlert.click()
    await page.waitForTimeout(3000);
});


test.only('Prompt alert', async ({ page }) => {

    await page.goto('https://testautomationpractice.blogspot.com/');

    page.on('dialog', async dialog => {
        console.log(dialog.message());
        console.log(dialog.type()); //returns type of dialog -> prompt
        console.log(dialog.defaultValue()); //It returns the pre-filled input value shown in the prompt. Please enter your name: [John]. returns John
        expect(dialog.message()).toBe('Please enter your name:');

        await page.waitForTimeout(1000); // keeps alert open for 2 sec
        await dialog.accept('cucu'); //adding text to prompt dialog
        await page.waitForTimeout(1000); // keeps alert open for 2 sec
    })

    const PromptAlert = page.getByText('Prompt Alert');
    await PromptAlert.click()
    await page.waitForTimeout(3000);
});