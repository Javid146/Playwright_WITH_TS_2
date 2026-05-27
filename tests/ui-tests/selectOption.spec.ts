import { test } from '@playwright/test'

test('select', async ({ page }) => {
    //1. Select by value: <option value="blue">
    await page.getByLabel('Choose a color').selectOption('blue');

    //2. Select by value: <option value="blue">Blue</option>
    await page.getByLabel('Choose a color').selectOption({ value: 'blue' });

    //3. Select by label (visible text):
    //label refers to the visible text of <option> element inside <select> dropdown: <option value="blue">Blue</option>
    await page.getByLabel('Choose a color').selectOption({ label: 'Blue' });

    //4. Select by index
    //<option>Red</option>     <!-- index 0 -->
    //<option>Blue</option>    <!-- index 1 -->
    await page.getByLabel('Choose a color').selectOption({ index: 1 })

    //4. Multiple selected items
    await page.getByLabel('Choose multiple colors').selectOption(['red', 'green', 'blue']);

    //find specific dropdown and select option
    page.getByRole('combobox', { name: 'Country' }).selectOption('India');

    page.getByRole('combobox').selectOption('India');
    page.locator('select').selectOption('India');
})