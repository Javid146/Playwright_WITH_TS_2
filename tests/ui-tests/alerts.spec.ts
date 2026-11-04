import { test, expect } from '@playwright/test'

/*
by default dialog closes by itself. But if you use page.on('dialog') event then either accept() or dismiss() it.
console.log(dialog.message()) -> prints dialog text
*/
test('simple alert 1', async ({ page }) => {

    await page.goto('https://testautomationpractice.blogspot.com/');

    //1. register listener 
    page.on('dialog', async dialog => {
        console.log(dialog.message());
        console.log(dialog.type()); //returns type of dialog -> alert

        expect(dialog.type()).toBe('alert') //no await because dialog.type() in Playwright returns a synchronous value, not a Promise.
        await page.waitForTimeout(2000); // keeps alert open for 2 sec
        await dialog.dismiss(); //accept and dismiss is same. simple alert has only an OK button, not OK and Cancel.
    });

    //2. trigger the alert
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
        // await dialog.accept(); //Has OK and Cancel buttons. Accept is same as clicking OK button.
        await dialog.dismiss(); //Has OK and Cancel buttons.
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
        expect(dialog.message()).toEqual('Please enter your name:');
        expect(dialog.message()).toContainEqual('Please enter your name:');
        expect(dialog.message()).toBe('Please enter your name:');

        await page.waitForTimeout(1000); // keeps alert open for 2 sec
        await dialog.accept('cucu'); //adding text to prompt dialog
        await page.waitForTimeout(1000); // keeps alert open for 2 sec
    })

    const PromptAlert = page.getByText('Prompt Alert');
    await PromptAlert.click()
    await page.waitForTimeout(3000);
});


/*

toBe() checks whether both variables refer to the same object.
toEqual() checks whether their contents are equal.
For primitive values, toBe() and toEqual() effectively behave the same way.

1. Comparing primitive values 
expect(10).toBe(10);       // Pass
expect("Hello").toEqual("Hello"); // Pass

2. Comparing objects
const obj1 = { name: "John", age: 30 };s
const obj2 = { name: "John", age: 30 };

expect(obj1).toBe(obj2);    // Fail
expect(obj1).toEqual(obj2); // Pass

3. Comparing nested objects
const obj1 = {
    name: "John",
    address: {
        city: "Vancouver"
    }
};

const obj2 = {
    name: "John",
    address: {
        city: "Vancouver"
    }
};

expect(obj1).toEqual(obj2); // Pass
*/