import { test } from '../../fixtures/hooks-fixture';
import { expect } from '@playwright/test';
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
  // expect(bookingIdsResp.ok()).toBeTruthy();
  expect(bookingIdsResp.headers()['content-type']).toBe(restfulApiData.content_type);
});


test('[ GET BOOKING ] Verify that the user is able to fetch booking details for a booking id using GET API and receives', {
  tag: ['@api', '@uat'],
  annotation: {
    type: "Test Case Link",
    description: "https://dev.azure.com/wishinfinite/WishInfinite/_workitems/edit/9/"
  }
}, async ({ request }) => {
  const bookingResp = await request.get(`${apiPathData.booking_path}/${restfulApiData.booking_id}`);
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
  const apiContext = await playwright.request.newContext({
    baseURL: 'https://example.com',
  });

  const res = await apiContext.head('/file.pdf');
  console.log(res.status());
  await apiContext.dispose();
});


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

Use a custom APIRequestContext (newContext) when you need isolation for:
- cookies
- headers
- authentication state
- separate session data

This is useful when you want to avoid sharing state between tests or simulate multiple users.
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

    /*
    extraHTTPHeaders: means automatically attach these headers to every request made by this apiContext.
    equivalent to:
     headers: {
    'cookie': `token=${apiToken}`
    }
    BUT with extraHTTPHeaders, you set it once for the whole context. So every request from this context will include given headers.
    */
    extraHTTPHeaders: {
      'cookie': `token=${apiToken}`
    }
  });

  const deleteBookingResp = await apiContext.delete(
    `${apiPathData.booking_path}/${restfulApiData.booking_id4}`
  );

  expect(deleteBookingResp.status()).toBe(201);
  expect(deleteBookingResp.statusText()).toBe('Created');

  /* 
  cleanup. If you are using the Playwright built-in request fixture, like test('my test', async ({ request }): 
  then you do NOT need dispose() at all. Because request fixture is managed by Playwright
  */
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
  //put
  const res = await request.fetch('https://example.com/api/users/1', {
    method: 'put',
    data: {
      name: 'John Updated',
    },
  });

  expect(res.ok()).toBeTruthy();
});

test('[ FETCH ] DELETE request', async ({ request }) => {
  //delete
  const res = await request.fetch('https://example.com/api/users/1', {
    method: 'delete',
  });

  expect(res.status()).toBe(204);
});

test('[ FETCH ] HEAD request (headers only)', async ({ request }) => {
  //head
  const res = await request.fetch('https://example.com/file.pdf', {
    method: 'head',
  });

  console.log(res.status());
  console.log(res.headers());
});

test('[ FETCH ] dynamic method use case', async ({ request }) => {
  //Useful when method comes from config / data / test input
  const method = 'post'; // can be dynamic

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
  form.set('name', 'John');
  form.append(
    'file',
    new File(['hello'], 'hello.txt', { type: 'text/plain' })
  );

  const res = await request.fetch('https://example.com/api/upload', {
    multipart: form, //multipart = “send data as a form (like HTML form upload), including files” not as json
  });

  expect(res.ok()).toBeTruthy();
});


test('waitForRequest - verify API request is sent', async ({ page }) => {

  await page.goto('https://example.com');

  /**
   * Start listening BEFORE the action happens.
   * This ensures we don't miss fast network calls.
   */
  const requestPromise = page.waitForRequest(request =>
    request.url().includes('/api/login') && request.method() === 'POST'
  );

  /**
   * Trigger the action that causes the request.
   * Example: user clicks login button.
   */
  await page.getByRole('button', { name: 'Login' }).click();

  /**
   * Wait until the matching request is seen.
   * This only confirms the request was sent,
   * NOT that it succeeded.
   */
  const request = await requestPromise;
  console.log('Request sent to:', request.url());
  expect(request.method()).toBe('POST');
});


test('waitForResponse - verify API response is received', async ({ page }) => {

  await page.goto('https://example.com');

  /**
   * Start waiting for the API response BEFORE triggering the action.
   * This listens for the server response, not just the request.
   */
  const responsePromise = page.waitForResponse(response =>
    response.url().includes('/api/login') && response.status() === 200
  );

  /**
   * Trigger the API call (user action).
   */
  await page.getByRole('button', { name: 'Login' }).click();

  /**
   * Wait for the server response to come back.
   * This confirms:
   * - request was sent
   * - server responded
   * - response status is OK
   */
  const response = await responsePromise;
  console.log('Response status:', response.status());
  expect(response.ok()).toBeTruthy();
});


test('request.failure() example', async ({ page }) => {
  /**
   * request.failure()
   *
   * - Works only for failed network requests.
   * - Returns:
   *     null              -> request succeeded
   *     { errorText: ... } -> request failed
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
   * page.route() intercepts network requests BEFORE they are sent to the server.
   *
   * Pattern '/api/login' means:
   * - match any domain
   * - match any path ending with /api/login
   * This allows us to inspect, modify, block, or mock requests.
   */
  await page.route('**/api/login', async route => {

    /**
     * route.request()
     * Gives access to the actual Request object (headers, URL, body, etc.)
     */
    const request = route.request();

    /**
     * request.postData()
     * Extracts the request body (payload) sent in POST request.
     * Returns string or null (if no body exists).
     */
    capturedBody = request.postData();
    console.log('Captured login request:', capturedBody);

    /**
     * route.continue()
     * IMPORTANT: Without this, the request would be blocked/stopped here.
     *
     * continue() means:
     * "Send the request to the real server as normal, unchanged."
     *
     * You can think of it as:
     * → intercept → inspect → forward request
     */
    await route.continue();
  });

  /**
   * Trigger a network request WITHOUT UI interaction.
   * This simulates frontend behavior using fetch().
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
   * page.route()
   *
   * WHY we need it:
   * - It intercepts network requests BEFORE they reach the real backend
   * - We use it to mock (fake) API responses
   *
   * In this case:
   * - Any request matching '**/api / login'
    * - will NOT go to the real server
      * - instead, Playwright will handle it here
        */
  await page.route('**/api/login', async route => {

    /**
     * route.fulfill()
     *
     * WHY we use it:
     * - It allows us to MOCK the server response completely
     * - No real API call is made
     *
     * What happens here:
     * - We STOP the real request from going to backend
     * - We RETURN a fake response manually
     *
     * Think of it like:
     * "Pretend the server replied with this data"
     */
    await route.fulfill({
      status: 200, // HTTP status code returned to frontend
      contentType: 'application/json',

      /**
       * Fake response body sent back to the app
       * This is what frontend receives as API response
       */
      body: JSON.stringify({
        success: true,
        token: 'fake-jwt-token-123'
      })
    });
  });

  /**
   * page.request.post()
   *
   * WHY we use it:
   * - This sends an API request directly from Playwright (Node side)
   * - No UI interaction needed
   * - No browser execution needed (unlike page.evaluate)
   *
   * This simulates calling the login API
   */
  const response = await page.request.post('/api/login', {
    data: {
      username: 'testUser',
      password: 'testPass123'
    }
  });

  /**
   * This is NOT real backend response.
   * It is the MOCK response we defined in route.fulfill().
   *
   * So instead of hitting server, it returns:
   * {
   *   success: true,
   *   token: 'fake-jwt-token-123'
   * }
   */
  const body = await response.json();
  expect(body.success).toBe(true);
});