import { test, expect } from "@playwright/test";
import fs from 'fs'

// SECRET_KEY=javid5 npx playwright test download.spec.ts 
test('download', async ({ page }) => {

    await page.goto("https://demo.automationtesting.in/FileDownload.html")

    // Start waiting for download before clicking. Note no await.
    const downloadPromise = page.waitForEvent('download'); //no await because This does NOT wait immediately. It only starts a listener
    // await page.getByRole('button', { name: 'Download' }).click();
    await page.locator('xpath=//a[@href="https://github.com//sakinala/AutomationTesting/raw/master/samplefile.pdf"]').click();
    const download = await downloadPromise; //waits here

    // Wait for the download process to complete and save the downloaded file somewhere.
    const filePath = 'tests/ui-tests/downloads/' + download.suggestedFilename();
     const tempDownloadPath = await download.path() //file is downloaded to temp location by playwright
    console.log("tempDownloadPath: " + tempDownloadPath)

    await download.saveAs(filePath); //file is copied with saveAs() from temp folder file downloaded.

    const failure = await download.failure();
    console.log("failure: " + failure); //output: null -> success; string -> failure reason

    expect(fs.existsSync(filePath)).toBeTruthy(); //fs -> file system
    expect(download).toBeTruthy();

    await download.delete(); //Playwright will automatically remove temporary download file. so this line is not needed usually
})

/*
 * DOWNLOAD HANDLING IN PLAYWRIGHT
 *
 * 1) waitForEvent('download')  → PROMISE style (recommended for tests)
 *
 * - Starts waiting for the NEXT download event immediately
 * - Pauses test execution until download happens
 * - Captures only ONE download per call
 * - No manual syncing needed
 *
 * Example flow:
 *   const downloadPromise = page.waitForEvent('download');
 *   await page.click('Download');
 *   const download = await downloadPromise;
 *
 * ✔ Best for: deterministic UI tests
 * ✔ Safe: no race conditions
 * ✔ Easy to reason about

 * 2) page.on('download')  → EVENT LISTENER style
 *
 * - Listens continuously for ALL download events
 * - Does NOT block or wait for anything
 * - Runs callback whenever download happens
 * - You must manually sync/wait in test if needed
 *
 * Example flow:
 *   page.on('download', download => {
 *     // handle download whenever it happens
 *   });
 *
 * ⚠ Needs manual coordination (timeouts / flags / promises)
 * ⚠ Can easily lead to flaky tests if not handled properly
 *
 * ✔ Best for: logging, debugging, monitoring multiple downloads
 * ❌ Not ideal for strict test assertions
 */

test('download using page.on (listener)', async ({ page }) => {

  await page.goto('https://demo.automationtesting.in/FileDownload.html');

  let downloadedFilePath: string;

  /**
   * LISTENER STYLE:
   * This listens continuously for ALL download events.
   * Does NOT block test execution.
   */
  page.on('download', async download => {

    const filePath = `tests/downloads/${download.suggestedFilename()}`;
    await download.saveAs(filePath);
    downloadedFilePath = filePath;
  });

  await page.click('a[href*="samplefile.pdf"]');

  /**
   * IMPORTANT:
   * We must manually wait here because listener is async.
   */
  await page.waitForTimeout(1000);

  expect(fs.existsSync(downloadedFilePath!)).toBeTruthy();
});