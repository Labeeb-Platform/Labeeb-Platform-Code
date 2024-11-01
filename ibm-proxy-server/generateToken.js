const axios = require('axios');

const apiKey = 'v-eUfsyk0RxN9bgBshUAp85W1yVv-XI-Tv_071k865RM';

const getToken = async () => {
  try {
    const response = await axios.post(
      'https://iam.cloud.ibm.com/identity/token',
      new URLSearchParams({
        grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
        apikey: apiKey,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log("Generated Token:", response.data.access_token);
  } catch (error) {
    console.error("Error generating token:", error.response ? error.response.data : error.message);
  }
};

getToken();
