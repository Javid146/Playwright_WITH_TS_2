import { test } from '@playwright/test'


//this is for login via chrome as global setup. logs in once and tests do not need to log in each time
test.use({
    storageState:'./playwright/auth/global-setup-chrome-non-spec.json'
})

test('first', { tag: '@first' }, async ({
}) => {
    console.log("1st test")
})

test('second', { tag: '@second' }, async ({
}) => {
    console.log("2nd test")
})

test('third', { tag: '@third' }, async ({
}) => {
    console.log("3rd test")
})

/*
tags work inside test name too. tag annotation is not required '({tag: })'
Because --grep searches test titles + describe blocks
*/
test('fourth @fourth', async ({
}) => {

    console.log("4th test")
})

//can also tag all tests in describe group or provide multiple tags and annotations
test.describe('separate test group', {

    tag: ['@slow', '@vrt'],
    annotation: [
        { type: 'issue', description: 'https://github.com/microsoft/playwright/issues/23180' },
        { type: 'performance', description: 'very slow test!' }
    ]
}, () => {
    test.beforeAll('before all', () => {
        console.log("this runs once before all")
    })

    test.beforeEach('before each hook', async ({ isMobile }) => {
        test.fixme(isMobile, 'Settings page does not work in mobile yet');
        console.log('beforeEach hook: for web only')
    });

    test('test 1', async () => {
        console.log('test with multiple tags and annotations')
    });

    test('test 2', async () => {
        console.log('test with multiple tags and annotations')
    });

    test.skip('test 3', async () => {
        console.log('for chrome only')
    });
});

/*
fixme() is conditional skip. isMobile === true test is skipped
beforeEach() does not run if you run test with specific tag.
e.g. npx playwright test --grep @third -> beforeEach() below won't run. Because test that has @third tag is not in same group with below beforeEach().
Hooks are not “tests”, so they don’t support tag, annotation.
beforeEach() would only run it is in same describe block with tests that are included in --grep. e.g. 
SECRET_KEY=javid5 npx playwright test --grep @vrt beforeEach() will run because it is hook for test that has @vrt tag
*/
test.beforeEach('before each hook', async ({ isMobile }) => {
    test.fixme(isMobile, 'Settings page does not work in mobile yet');
    console.log('for web only')
});

test('user profile', async ({ isMobile }) => {
    test.fixme(isMobile, 'Settings page does not work on mobile');
    console.log('for web only ')
});

/*
How To Run: grep means filter
1. run specific test                                ->  npx playwright test --grep @fast
2. run all tests except with this tag               ->  npx playwright test --grep-invert @fast
3. run any test that contains either tag            ->  npx playwright test --grep "@fast|@slow"  (regex)
4. run tests containing both tags                   ->  npx playwright test --grep "(?=.*@fast)(?=.*@slow)" (regex)
*/
