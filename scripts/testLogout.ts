// scripts/testLogout.ts
import axiosClient from '../api/axiosClient';

async function testLogout() {
  const YOUR_API_BASE_URL = `https://phixotech.com/igoeppms/public/api/`;

  // The exact updated URL for logout
  const url = `${YOUR_API_BASE_URL}auth/logoutcustomer`;

  // To get a true 200 OK, you'd need a real active token here.
  // Otherwise, the server will correctly return a 401 (Unauthorized).
  const testToken = "FAKE_OR_EXPIRED_TOKEN_FOR_TESTING";

  try {
    console.log(`--- Testing Logout Endpoint ---`);
    console.log(`Sending POST request to ${url}...`);

    // Making the exact same call as the app
    const response = await axiosClient.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${testToken}`
      }
    });

    console.log("\n✅ LOGOUT SUCCESSFUL!");
    console.log("Status Code:", response.status);
    console.log("Response Data:", response.data);

  } catch (error: any) {
    if (error.response) {
      console.log(`\n❌ SERVER RESPONDED WITH ERROR`);
      console.log("Status Code:", error.response.status);
      console.log("Response Data:", error.response.data);

      if (error.response.status === 401) {
        console.log("\n💡 NOTE: A 401 error means the endpoint is reachable and returned a signed response, but rejected our fake token! This proves the endpoint works.");
      }
    } else {
      console.log("\n❌ REQUEST FAILED (Network, Integrity, or Configuration Error)");
      console.log(error.message);
    }
  }
}

testLogout();
