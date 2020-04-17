const fetch = require('node-fetch');
const base64 = require("base-64");

const BASE_URL = "http://freenas.local" || process.env.FREENAS_SRV_URL;
const FREENAS_USERNAME = 'root' // at this point in time only root can use the API;
const FREENAS_PASSWORD = 'test123$' || process.env.FREENAS_PASS;

async function sendRequest(endpoint, method, data){
    // initalizes the options for the request by adding auth headers, that would need to be sent with any request by default
    const request_options = {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Basic ${base64.encode(`${FREENAS_USERNAME}:${FREENAS_PASSWORD}`)}`
        }
    };

    //adds a request method to the options if it is provided as an argument
    if (method) request_options.method = method;
    
    //adds a request body to the options if it is provided as an argument
    if (data) request_options.body = JSON.stringify(data);

    const response = await fetch(`${BASE_URL}/${endpoint}`, request_options).catch((err) => { console.error(err) });
    if (await response.ok) return await response.json();
    else {
        throw new Error(`HTTP error! status: ${await response.status}`);
    }
}

// sendRequest('/api/v1.0/').then(res => console.log(res));