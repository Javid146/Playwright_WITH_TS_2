import { PracticeCommonUtil } from "./PracticeCommonUtil";
import { test as base } from './PracticePomFixture'

type commonFix = {
    practiceCommonUtil: PracticeCommonUtil
}

export const test = base.extend<commonFix>({

    practiceCommonUtil: async ({ }, use) => {
        await use(new PracticeCommonUtil())
    }
})


