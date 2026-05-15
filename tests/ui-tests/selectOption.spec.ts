import { test } from '@playwright/test'

test('select', async ({ page }) => {
    // Single selection matching the value or label
    await page.getByLabel('Choose a color').selectOption('blue');

    // Single selection matching the label
    await page.getByLabel('Choose a color').selectOption({ label: 'Blue' });

    // Multiple selected items
    await page.getByLabel('Choose multiple colors').selectOption(['red', 'green', 'blue']);

    //find specific dropdown and select option
    page.getByRole('combobox', { name: 'Country' }).selectOption('India');

    page.getByRole('combobox').selectOption('India');
    page.locator('select').selectOption('India');
})