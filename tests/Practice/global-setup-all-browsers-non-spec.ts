import { PracticeCommonUtil } from './PracticeCommonUtil'
import { PracticePage } from './PracticePage'
import { chromium, firefox, webkit, BrowserType } from '@playwright/test'
const practiceCommonUtil = new PracticeCommonUtil();

/*
this setup is for chrome, edge (chrome is for both edge/chrome), firefox, safari (webkit) browsers login. there can be only 1 global setup. 
globalSetup: require.resolve('./tests/Practice/global-setup-all-browsers-non-spec.ts').

But if multiple setups needed then project specific setups can be created so each project can use required login state for needed browserType. e.g.:
projects: [
  {
    name: 'chromium',
    use: { storageState: './auth/chromium.json' }
  },
  {
    name: 'firefox',
    use: { storageState: './auth/firefox.json' }
  },
  {
    name: 'webkit',
    use: { storageState: './auth/webkit.json' }
  }
]
*/
async function loginAndSave(browserType: BrowserType, path: string) {
  const browser = await browserType.launch({ headless: false })
  const page = await browser.newPage();
  const practicePage = new PracticePage(page);

  const username = practiceCommonUtil.decryptData(process.env.USER_NAME!)
  const pwd = practiceCommonUtil.decryptData(process.env.PASSWORD!)

  await practicePage.goToHrm()
  await practicePage.loginToHrm(username, pwd)
  await page.waitForURL('**/dashboard/index');

  await page.context().storageState({ path })
  await browser.close()
}

async function globalSetupForAllBrowsers() {
  await loginAndSave(chromium, './auth/chromium.json');
  // await loginAndSave(firefox, './auth/firefox.json');
  // await loginAndSave(webkit, './auth/webkit.json');
}

export default globalSetupForAllBrowsers
