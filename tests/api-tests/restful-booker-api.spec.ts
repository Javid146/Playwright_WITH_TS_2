import { test, expect } from '../../fixtures/hooks-fixture';
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
0});

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


test('[ PATCH ] Verify that the user is able to partially update existing booking using PATCH API and receive valid response.',
  {
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
}, async ({request, commonApiUtils}) => {
  const apiToken = await commonApiUtils.createToken(); //change .booking_id2 from restfulApiData file as after deletion test will fail
  const deleteBookingResp = await request.delete(`${apiPathData.booking_path}/${restfulApiData.booking_id4}`, {
    headers: {
      'cookie': `token=${apiToken}`
    }
  });
  expect(deleteBookingResp.status()).toBe(201);
  expect(deleteBookingResp.statusText()).toBe("Created");
});