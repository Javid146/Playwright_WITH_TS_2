import { test } from '../../fixtures/hooks-fixture';
import { expect } from "@playwright/test";
import apiPathData from "../../test-data/api-data/api-path-data.json"
import restfulApiData from "../../test-data/api-data/restful-booker-api-module-data.json"

/* 
  API Test Setup:

  - baseURL is set in playwright.config.ts using:
      baseURL: process.env.API_BASE_URL,
      extraHTTPHeaders: { Accept: 'application/json' }

  - API_BASE_URL is defined in env files. We have two environments: demo and dev.
    For practice, only the demo env has a valid URL. 
    This ensures that all tests (script or CLI) run against the demo environment.

  - API tests are configured in a separate project in playwright.config.ts:
      {
        name: 'APITest',
        testDir: './tests/api-tests'
      }
    This directs Playwright to the API test folder and avoids launching any browser.
    No device lines are needed since these are API-only tests.

  How to run:

  Option 1: npm script (defined in package.json)
    npm run demo_api

  Option 2: Direct Playwright CLI with environment variable
    bash: ENV_NAME=demo npx playwright test --project=APITest

  Note: These are API-only tests, so no secret key or UI login is required.
*/


/*
1. async ({ request }) => {}:

   Means: Extract ONLY the `request` property from the fixture object.
   This JavaScript feature is called object destructuring (often called fixture destructuring in Playwright).

   Think of Playwright as passing an object like this:

   testContext = { //testContext is random name I chose for the entire fixture object
     page,
     request,
     browser,
     context
   };

   This is a simplified illustration of the built-in fixtures.

   async ({ request }) => {}

   is equivalent to:

   async (fixtures) => {
     const request = fixtures.request;
   }

   Here:
   - `fixtures` is a parameter name I chose for the entire fixture object.
   - `request` is a local variable that receives the value of the built-in request fixture.
   - `page`, `context`, and `browser` are NOT extracted in the destructured version.

   If I write:

   async (fixtures) => {
     fixtures.page;
     fixtures.request;
     fixtures.context;
   }

   I receive the entire fixture object and can access its properties.

   IMPORTANT:
   `fixtures` is NOT a built-in Playwright fixture.
   It is just a parameter name chosen by the developer.
   `page`, `request`, `context`, and `browser` are built-in fixture names.

2. import { request } from '@playwright/test';

   This `request` is DIFFERENT from the built-in `request` fixture.

   The imported `request` is an APIRequest factory.
   Calling request.newContext() creates a new APIRequestContext.

   Example:
   import { request } from '@playwright/test';

   const reqContext = await request.newContext({
     baseURL: 'https://restful-booker.herokuapp.com'
   });

   Now I can use:

   reqContext.get()
   reqContext.post()
   reqContext.put()
   reqContext.patch()
   reqContext.delete()

   By contrast, in:
   test('API test', async ({ request }) => {
     const response = await request.get('/booking');
   });

   `request` is the built-in APIRequestContext fixture provided by Playwright.
   It is already created and ready to use, so I do NOT need to call newContext().

   SUMMARY:

   - import { request } from '@playwright/test'
     -> APIRequest factory; use request.newContext() to create a context.

   - async ({ request }) => {}
     -> Extracts the built-in request fixture from the fixture object.

   - async (fixtures) => {}
     -> Receives the entire fixture object; access the request fixture using fixtures.request.

   CAR ANALOGY:

   const car = {
     engine: 'V8',
     wheels: 4,
     gps: true
   };

   function drive(car) {
     // car receives the entire object
     console.log(car.engine);
   }

   function drive({ engine }) {
     // engine receives only the engine property's value
     console.log(engine);
   }

   This is the same object-destructuring principle used with Playwright fixtures.
*/

//CHECK DOCUMENTATION HERE: https://restful-booker.herokuapp.com/apidoc/index.html
test('[ GET ALL BOOKINGS ] Verify that the user is able to fetch all the booking IDs using GET API and receive valid response', {
  tag: ["@api", "@uat"],
  annotation: {
    type: "Test Case Link",
    description: "https://dev.azure.com/wishinfinite/wishinfinite/_workitems/edit/8"
  },
}, async ({ request }) => {
    const bookingIdsResp = await request.get(apiPathData.booking_path);
    const bookingIdsJsonResp = await bookingIdsResp.json();
    console.log(bookingIdsJsonResp);
    expect(bookingIdsResp.status()).toBe(200);
    expect(bookingIdsResp.statusText()).toBe('OK');

    // response.ok() returns true if status is between 200–299
    // toBeTruthy() passes if the value is true
    expect(bookingIdsResp.ok()).toBeTruthy();

    /*
    In JavaScript objects, you can access properties in two ways:

    1. Dot notation: obj.key

    Is good for simple keys (no symbols, no spaces).
    Header names that contain a dash -, is not valid in dot notation. e.g. response.headers() returns:
    {
    "content-type": "application/json",
    "cache-control": "no-cache"
    }
    
    response.headers().content-type ❌ invalid -> Because JavaScript interprets it as: headers().content - type ❌ (subtraction!)

    2. Bracket notation: obj['key-name']
    response.headers()['content-type'] ✅
    */
    expect(bookingIdsResp.headers()['content-type']).toBe(restfulApiData.content_type);
  });


//test without using tags and annotations
test('[ GET BOOKING ] Verify that the user is able to fetch booking details for a booking id using GET API and receives', async ({ request }) => {
  const bookingResp = await request.get(`${apiPathData.booking_path}/${restfulApiData.booking_id}`); //request -> Fixture API client

  /*
  bookingResp -> This is a Response object, not usable data. You can only do:
  bookingIdsResp.status()
  bookingIdsResp.headers()
  bookingIdsResp.json()
 
  bookingIdsResp.text() -> returns raw response as a string: {"bookings":[1,2,3]}, not like a json object. 
  can manually convert it to json object: const data = JSON.parse(await bookingIdsResp.text())
  const data = JSON.parse(await bookingIdsResp.text()); =   const data = await bookingIdsResp.json();

  You can NOT do this because bookingIdsResp is a Response object, not a JSON object:
  bookingIdsResp.bookings ❌
  bookingIdsResp[0] ❌

  const data = await bookingIdsResp.json();

  .json() parses the JSON response body into a JavaScript value.

  JSON response body:
  {
    "bookings": [1, 2, 3]
  }

  After parsing, `data` is a JavaScript object equivalent to:
  {
    bookings: [1, 2, 3]
  }

  Now you can access the array:
  console.log(data.bookings);
  expect(data.bookings.length).toBeGreaterThan(0);
  */
  const bookingJsonResp = await bookingResp.json();
  console.log(bookingJsonResp);

  expect(bookingResp.status()).toBe(200);
  expect(bookingResp.statusText()).toBe("OK");
  expect(bookingResp).not.toBeNull();
});


/*
head: similar to get(), but faster and returns only headers, status and cookies; so can't do response.text() or response.json();
good to check if resource exists. get() returns full page data.
*/


test('[ HEAD ]', async ({ playwright }) => {
  // playwright is a built-in fixture that provides the Playwright API object.
  // playwright.request.newContext() creates a new, standalone APIRequestContext.
  const apiContext = await playwright.request.newContext({
    baseURL: 'https://example.com',
  });

  // apiContext supports get, post, put, patch, delete, head, etc.
  const res = await apiContext.head('/file.pdf');

  console.log(res.status());

  // Dispose of the manually created context when finished.
  await apiContext.dispose();
});


/*
The code below achieves the same purpose, but imports the request factory
directly to create a new APIRequestContext.

This allows you to create multiple independent API contexts with different
baseURLs, headers, and other configuration options in the same test.

import { request, type APIRequestContext } from '@playwright/test';

test('[ HEAD ]', async () => {
  const newContext: APIRequestContext = await request.newContext({
    baseURL: 'https://google.com',
  });

  const res = await newContext.head('/file.pdf');
  console.log(res.status());

  await newContext.dispose();
});


BUILT-IN REQUEST FIXTURE:

async ({ request }) => { ... }

The request fixture is provided directly by Playwright Test.
It is already an APIRequestContext, so you can send requests without
creating another context or disposing of the fixture yourself.

test('[ HEAD ]', async ({ request }) => {
  const res = await request.head('https://example.com/file.pdf');
  console.log(res.status());
});

IMPORTANT:
- { request } and { playwright } are separate built-in fixtures.
- playwright.request.newContext() creates a new APIRequestContext.
- The imported request factory can also create a new APIRequestContext.
- The built-in { request } fixture is already ready to use.
*/


 

test("[ POST ] Verify that the user is able to Create new booking using Post API and receive valid response.", {
  tag: ['@api', '@uat'],
  annotation: {
    type: "Test Case Link",
    description: "https://dev.azure.com/wishinfinite/WishInfinite/_workitems/edit/9/"
  }
}, async ({ request }) => {

  // Send POST request to booking API with test data
  const createBookingResp = await request.post(apiPathData.booking_path, {
    data: restfulApiData.create_booking
  });

  // Convert API response to JSON
  const createBookingJsonResp = await createBookingResp.json();
  console.log(createBookingJsonResp)

  // Assert status code = 200
  expect(createBookingResp.status()).toBe(200);

  // Assert response object matches the request payload
  expect(createBookingJsonResp.booking).toMatchObject(restfulApiData.create_booking);
});


test('[ PUT ] Verify that the user is able to Update existing booking using Put API and receive valid response.', {
  tag: ['@api', '@uat'],
  annotation: {
    type: "Test Case Link",
    description: "https://dev.azure.com/wishinfinite/WishInfinite/_workitems/edit/11/"
  }
},
  async ({ commonApiUtils, request }) => {

    const tokenValue = await commonApiUtils.createToken()
    const updateBookingResp = await request.put(`${apiPathData.booking_path}/${restfulApiData.booking_id3}`, {
      headers: {
        Cookie: `token=${tokenValue}`, //auth by token/cookie
        "Content-Type": "application/json"
      },
      data: restfulApiData.update_booking //update_booking is payload from json file for PUT call
    });

    const updateBookingJsonResp = await updateBookingResp.json();
    console.log(updateBookingJsonResp);
    expect(updateBookingResp.status()).toBe(200);
    expect(updateBookingJsonResp).toMatchObject(restfulApiData.update_booking);
  });


test('[ PATCH ] Verify that the user is able to partially update existing booking using PATCH API and receive valid response.', {
  tag: ['@api', '@uat'],
  annotation: {
    type: "Test Case Link",
    description: "https://dev.azure.com/wishinfinite/WishInfinite/_workitems/edit/12/"
  }
}, async ({ request, commonApiUtils }) => {
  const apiToken = await commonApiUtils.createToken();
  const partialUpdateBookingResp = await request.patch(`${apiPathData.booking_path}/${restfulApiData.booking_id}`, {
    headers: {
      "Cookie": `token=${apiToken}`,
      "Content-Type": "application/json"
    },
    data: restfulApiData.update_booking_with_patch
  });

  /*
  console.log({ partialUpdateBookingJsonResp }):
  - With curly bracesreates an object with a property named partialUpdateBookingJsonResp, whose value is the variable's value. The console displays something like:

  {
    partialUpdateBookingJsonResp: {
      firstname: "John",
      lastname: "Smith"
    }}

  - Without curly braces, it logs the value of the variable directly, without wrapping it in an object. The console displays something like:
  {
  "firstname": "John",
  "lastname": "Smith"
  }  
  */


  const partialUpdateBookingJsonResp = await partialUpdateBookingResp.json();
  console.log({ partialUpdateBookingJsonResp })
  expect(partialUpdateBookingResp.status()).toBe(200);
  expect(partialUpdateBookingJsonResp.firstname).toMatch(restfulApiData.update_booking_with_patch.firstname);
  expect(partialUpdateBookingJsonResp.lastname).toMatch(restfulApiData.update_booking_with_patch.lastname);
});


test('[ DELETE ] Verify that the user is able to delete existing booking using Delete API and receive valid response.', {
  tag: ['@api', '@uat'],
  annotation: {
    type: "Test Case Link",
    description: "https://dev.azure.com/wishinfinite/WishInfinite/_workitems/edit/13/"
  }
}, async ({ request, commonApiUtils }) => {
  const apiToken = await commonApiUtils.createToken(); //change .booking_id2 from restfulApiData file as after deletion test will fail
  const deleteBookingResp = await request.delete(`${apiPathData.booking_path}/${restfulApiData.booking_id4}`, {
    headers: {
      'cookie': `token=${apiToken}`
    }
  });
  expect(deleteBookingResp.status()).toBe(201);
  expect(deleteBookingResp.statusText()).toBe("Created");
});


/*
Delete request below using a custom APIRequestContext (playwright.newContext()).
The tests above use the built-in `request` fixture ready to send requests, which is also an APIRequestContext managed by Playwright.

Use a custom APIRequestContext (newContext) when you need isolation (different api defined in config file) for:
- cookies
- headers
- authentication state
- separate session data

This is useful when you want to avoid sharing state between tests or simulate multiple users.

=================
extraHTTPHeaders: means automatically attach these headers to every request made by this apiContext.
equivalent to:
  headers: {
'cookie': `token=${apiToken}`
}
BUT with extraHTTPHeaders, you set it once for the whole context. So every request from this context will include given headers.

=================
cleanup. If you are using the Playwright built-in request fixture, like test('my test', async ({ request }): 
then you do NOT need dispose() at all. Because request fixture is managed by Playwright
await apiContext.dispose();
*/

test('[ DELETE ] Verify that the user is able to delete existing booking using Delete API and receive valid response.', {
  tag: ['@api', '@uat'],
  annotation: {
    type: 'Test Case Link',
    description: 'https://dev.azure.com/wishinfinite/WishInfinite/_workitems/edit/13/'
  }
}, async ({ commonApiUtils, playwright }) => {

  const apiToken = await commonApiUtils.createToken();

  // create APIRequestContext manually
  const apiContext = await playwright.request.newContext({
    baseURL: process.env.API_BASE_URL,
    extraHTTPHeaders: {
      'cookie': `token=${apiToken}`
    }
  });

  const deleteBookingResp = await apiContext.delete(
    `${apiPathData.booking_path}/${restfulApiData.booking_id4}`
  );

  expect(deleteBookingResp.status()).toBe(201);
  expect(deleteBookingResp.statusText()).toBe('Created');

  await apiContext.dispose();
});


/*
  fetch() is a low-level, flexible HTTP method in Playwright. It can do EVERYTHING:
  - GET
  - POST
  - PUT
  - DELETE
  - HEAD 

  Instead of separate methods (get/post/etc), you define everything manually.

  ✅ WHY IT IS USEFUL:
  - One method for all HTTP verbs
  - Useful when method is dynamic (data driven)
  - Useful for generic wrappers / API clients
  - Supports form data + multipart uploads easily

  ❌ WHY NOT ALWAYS USE IT:
  - Less readable than request.get()/post()
  - Easy to misuse (wrong method, missing headers)
  - Harder for beginners to understand
  - Overkill for simple API tests
*/

test('[ FETCH ] basic GET request', async ({ request }) => {
  //fetch() defaults to GET if method is not specified
  const res = await request.fetch('https://example.com/api/users');
  expect(res.ok()).toBeTruthy();
  console.log(await res.json());
});

test('[ FETCH ] POST request (JSON body)', async ({ request }) => {

  await request.fetch('https://example.com/api/data', {
    method: 'post',
    headers: {
      Authorization: `Bearer 232sdfsdwesdzdwdsvsds`,
      'Content-Type': 'application/json',
    },
    data: {
      name: 'John',
    },
  });
});

test('[ FETCH ] PUT request (update data)', async ({ request }) => {

  const res = await request.fetch('https://example.com/api/users/1', {
    method: 'put',
    data: {
      name: 'John Updated',
    },
  });

  expect(res.ok()).toBeTruthy();
});

test('[ FETCH ] DELETE request', async ({ request }) => {

  const res = await request.fetch('https://example.com/api/users/1', {
    method: 'delete',
  });

  expect(res.status()).toBe(204);
});

test('[ FETCH ] HEAD request (headers only)', async ({ request }) => {

  const res = await request.fetch('https://example.com/file.pdf', {
    method: 'head',
  });

  console.log(res.status());
  console.log(res.headers());
});

test('[ FETCH ] dynamic method use case', async ({ request }) => {
  //Useful when method comes from config / data / test input
  const method = 'post'; // can be dynamic put, patch depending on data-driven test

  const res = await request.fetch('https://example.com/api/login', {
    method,
    data: {
      username: 'test',
      password: '1234',
    },
  });

  expect(res.ok()).toBeTruthy();
});

test('[ FETCH ] multipart form-data upload', async ({ request }) => {
  //file upload
  const form = new FormData();
  form.set('name', 'John'); //value of form field: <input name="name" value="John">. not very important, just for demonstration.
  form.append(
    'file', new File(['hello'], 'hello.txt', { type: 'text/plain' })
  );

  const res = await request.fetch('https://example.com/api/upload', {
    multipart: form //multipart = “send data as a form (like HTML form upload), including files” not as json
  });

  expect(res.ok()).toBeTruthy();
});


test('waitForRequest - verify API request is sent', async ({ page }) => {

  await page.goto('https://example.com');

  /**
   * Start listening BEFORE the action happens. This ensures we don't miss fast network calls.
   */
  const requestPromise = page.waitForRequest(request =>
    request.url().includes('/api/login') && request.method() === 'POST'
  );

  /**
   * Trigger the action that causes the request. Example: user clicks login button.
   */
  await page.getByRole('button', { name: 'Login' }).click();

  /**
   * Wait until the matching request is seen. This only confirms the request was sent, NOT that it succeeded.
   */
  const request = await requestPromise;
  console.log('Request sent to:', request.url());
  expect(request.method()).toBe('POST');
});


test('waitForResponse - verify API response is received', async ({ page }) => {

  await page.goto('https://example.com');

  /**
   * Start waiting for the API response BEFORE triggering the action. This listens for the server response, not just the request.
   */
  const responsePromise = page.waitForResponse(response =>
    response.url().includes('/api/login') && response.status() === 200
  );

  /**
   * Trigger the API call (user action).
   */
  await page.getByRole('button', { name: 'Login' }).click();

  /**
   * Wait for the server response to come back. This confirms:
   * - request was sent, server responded
   * - response status is OK
   */
  const response = await responsePromise;
  console.log('Response status:', response.status());
  expect(response.ok()).toBeTruthy();
});


test('request.failure() example', async ({ page }) => {
  /**
   * request.failure():
   * Works only for failed network requests. Returns:
   *     null              -> request succeeded or does it does not have failure description
   *    { errorText: ... } -> request failed
   * 
   * null does not mean the request succeeded in every context. It means there is no failure description available. 
   * Inside a requestfailed event handler, the request has failed, but the failure details may be unavailable.
   */

  let failedRequestCaptured = false;

  // Listen for all failed requests.
  page.on('requestfailed', request => {
    failedRequestCaptured = true;

    const failure = request.failure();
    console.log('URL:', request.url());
    console.log('Method:', request.method());
    console.log('Failure object:', failure);
    console.log('Error text:', failure?.errorText);

    // Example output:
    // URL: https://this-domain-does-not-exist-12345.com
    // Error text: net::ERR_NAME_NOT_RESOLVED
  });

  // Navigate to a non-existent domain to force a request failure.
  await page.goto('https://this-domain-does-not-exist-12345.com').catch(() => {
    // Ignore navigation error because failure is expected.
  });

  // Verify that at least one failed request was captured.
  expect(failedRequestCaptured).toBe(true);
});


test('capture login API request payload (no UI)', async ({ page }) => {
  /**
   * capturedBody will store the request payload (POST body)
   *
   * Type: string | null means:
   * - string → when we successfully capture request body
   * - null   → before any request is captured (initial state)
   */
  let capturedBody: string | null = null;

  /*
  ================
1. set up interception BEFORE triggering the request. This ensures we don't miss fast network calls.
  * page.route() intercepts network requests BEFORE they are sent to the server.
  *
  * Pattern "** /api/login" means:
  * - match any domain and any path ending with ** /api/login. This allows us to inspect, modify, block, or mock requests.
   ===============
  rouuute.request():
  * allows inspecting the network layer behind UI actions.
  * Gives access to the actual Request object (headers, URL, body, etc.) it lets you inspect what the frontend is actually sending.
  ===============
  * rouuute.continue():
    Without this, the request would be blocked/stopped here.
  * continue() means: Send the request to the real server as normal, unchanged." You can think of it as: intercept → inspect → forward request
     */
  await page.route('**/api/login', async rouuute => {

    const request = rouuute.request();

    console.log('URL:', request.url());
    console.log('Method:', request.method());
    console.log('Headers:', request.headers());
    /**
     * request.postData(): Extracts the request body (payload) sent in POST request. Returns string or null (if no body exists).
     */ 
    capturedBody = request.postData();
    console.log('Captured login request:', capturedBody);

    await rouuute.continue();
  });


/**
 * Trigger a network request WITHOUT UI interaction. This uses fetch() inside the browser to send a real HTTP request.
 *
 * page.evaluate():
 * - runs the callback in the browser context, not in Node.js. The request follows browser networking rules and can use applicable browser cookies.
 * - tells Playwright to execute JavaScript inside the browser page. Inside that JavaScript, you can use fetch() to send different types of HTTP requests.
 * The Fetch API's body does not accept a plain JavaScript object directly as JSON. JSON.stringify() converts the object into a JSON string.
 *
 * =================================
 * Browser fetch() vs Playwright request.fetch()
 * =================================
 * 1. fetch() inside page.evaluate():
 *    - Runs in the browser.
 *    - Follows browser networking rules.
 *    - Can use applicable browser cookies.
 *    - Use body: JSON.stringify(object) to send JSON.
 *
 * 2. Playwright request.fetch():
 *    - Runs from the Node.js test side, not inside the browser.
 *    - Can send API requests without UI interaction or page navigation.
 *    - Playwright can serialize an object passed through the data option
 *      as JSON, so JSON.stringify() is usually unnecessary.
 */

  await page.evaluate(() => {
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testUser',
        password: 'testPass123'
      })
    });
  });

  expect(capturedBody).not.toBeNull();
  expect(capturedBody).toContain('testUser');
  expect(capturedBody).toContain('testPass123');
});


test('mock login API using route.fulfill()', async ({ page }) => {

  /**
   * page.route() -> You’re testing UI behavior under controlled API conditions, not the real backend.
   * Intercepts browser network requests BEFORE they reach backend.
   * Any frontend request to: /api/login will be intercepted by Playwright.
   */
  await page.route('**/api/login', async route => {

    /**
     * route.fulfill(): Instead of contacting real backend, Playwright returns fake response immediately. Frontend thinks this is a real server response.
     */
    await route.fulfill({
      status: 200,
      contentType: 'application/json',

      body: JSON.stringify({
        success: true,
        token: 'fake-jwt-token-123'
      })
    });
  });

  /**
   * Open login page in browser and log in
   */
  await page.goto('/login');
  await page.fill('#username', 'testUser');
  await page.fill('#password', 'testPass');

  /**
   * Click login button. Frontend will internally do something like: fetch('/api/login')
   * That request gets intercepted by page.route().
   */
  await page.click('button[type="submit"]');

  /**
   * UI assertion: Since mocked API returned: { success: true }, frontend should show successful login state.
   */
  await expect(page.locator('text=Logged in!')).toBeVisible();
});


test('login via UI then use authenticated page.request', async ({ page }) => {

  /**
   * 1. REAL USER FLOW: login through UI
   */
  await page.goto('/login');
  await page.fill('#username', 'testUser');
  await page.fill('#password', 'testPass123');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Logged in!')).toBeVisible();
  
/**
 * 2. UI login has completed, so the browser context may now contain
 * authentication cookies or other session data.
 *
 * WHY use page.request.get()?
 * - Sends an API request from Playwright's Node.js side.
 * - No UI interaction is needed to send the API request.
 * - No JavaScript execution inside the browser is needed (unlike page.evaluate()).
 * - Shares cookies with the associated browser context, so the API request can use the cookie-based session established by UI login.
 *
 * IMPORTANT:
 * - page.request does NOT automatically send localStorage tokens as API headers.
 *   If authentication relies on a token stored in localStorage, extract the token and add it to the request headers when needed.
 * - GET /api/profile checks whether the API recognizes the if user logged in and is in profile.
 *
 * WHY use page.request instead of the built-in { request } fixture?
 *
 * page.request:
 * - Associated with the page's browser context.
 * - Shares cookies with that browser context.
 * - Useful for API calls that need the browser's cookie-based session.
 *
 * Built-in { request } fixture:
 * - Provides a separate APIRequestContext by default.
 * - Does not automatically share the browser context's cookies.
 * - Useful for independent API calls with separately configured authentication headers or other credentials.
 *
 * SIMPLE RULE:
 * Use { request }  -> independent API requests with their own authentication setup.
 * Use page.request -> API requests that need the browser context's cookies. page.request itself does not perform UI interaction. 
 * You use the UI to log in first, then make an API call using the existing cookie-based session. You don't need to log in again through the API.
 */

//Use the browser context's session cookies automatically to verify user is logged in and is on profile.
  const response = await page.request.get('/api/profile');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.username).toBe('testUser');
});