import { test } from '@playwright/test'

/*
Playwright pierces Shadow DOM by default when using locators. You don't need shadow handling like in cypress (.shadow().find())
example:
<my-component>
  #shadow-root
    <button>Click me</button>
</my-component>

⚠️ Important exception: If Shadow DOM is closed ❌ Playwright cannot access it. No framework can: attachShadow({ mode: 'closed' })
*/
test('shadow', async ({ page }) => {
    await page.getByText('Click me').click();
})