import { test, expect } from "@playwright/test";



test('fastForward()', async ({ page }) => {

    await page.clock.install();
    await page.goto('https://example.com');
    await page.getByRole('button', { name: 'Send OTP' }).click();

    // Jump forward 15 minutes
    await page.clock.fastForward('15:00');
    // Jump forward 1 hour 15 minutes 10 seconds
    await page.clock.fastForward('1:15:10');
    await page.clock.fastForward('15:00');

    // Verify expiration message
    await expect(page.getByText('OTP expired')).toBeVisible();
});


test('pauseAt()', async ({ page }) => {

    //for current time clock.install() is enough. setting date is good e.g. to verify New Year message on ui
    await page.clock.install({
        time: new Date('2025-12-31T23:59:50')
    });

    await page.goto('https://example.com');

    // Jump to midnight and freeze there
    await page.clock.pauseAt('2026-01-01T00:00:00');

    await expect(page.getByText('Happy New Year!')).toBeVisible();

    //No timers continue unless resumed. use case: Pause at a precise moment, verify UI, then let the app continue.
    await page.clock.resume();
})


/*
await page.clock.install({ time: new Date('2025-12-31T23:59:50' )}); is exactly same as setSystemTime() but with 1 step:
await page.clock.install();
await page.clock.setSystemTime('2026-05-10T09:00:00');
*/
test('setSystemTime()', async ({ page }) => {

    await page.clock.install();
    await page.goto('https://example.com');

    // Change clock to tomorrow. Date.now() changes immediately and system moves starting from that time
    await page.clock.setSystemTime('2026-05-10T09:00:00');

    // later reset back to real time
    await page.clock.install({ time: new Date() });
})


test('runFor()', async ({ page }) => {

    //useful for testing UI features such as countdown, session timeout, otp expiration
    await page.clock.install();
    await page.goto('https://example.com'); // countdown starts at 10

    await page.clock.runFor('10'); //like countdown 10,9,8 -> 0
    await page.clock.runFor('10:00'); // run for 10 minutes
    await expect(page.getByText('0')).toBeVisible();
})