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
    const contentType = await response.headers.get("content-type");
    return {
        status: await response.status,
        data: (contentType && contentType.indexOf("application/json") !== -1) ? await response.json() : await response.text()
    }
}

async function createDataset(parent, options){
    return await sendRequest(`/api/v1.0/storage/dataset/${parent}/`, 'post', options);
}

async function deleteDataset(id){
    return await sendRequest(`/api/v1.0/storage/dataset/${id}`, 'delete');
}

async function updateDataset(id, new_options){
    return await sendRequest(`/api/v2.0/pool/dataset/id/${id}`, 'put', new_options);
}

async function createAfpShare(options){
    return await sendRequest(`/api/v1.0/sharing/afp/`, 'post', options)
}

async function createSmbShare(options){
    return await sendRequest(`/api/v1.0/sharing/cifs/`, 'post', options)
}

async function createNfsShare(options){
    return await sendRequest(`/api/v1.0/sharing/nfs/`, 'post', options)
}

async function deleteAfpShare(id){
    return await sendRequest(`/api/v1.0/sharing/afp/${id}/`, 'delete');
}

async function deleteSmbShare(id){
    return await sendRequest(`/api/v1.0/sharing/cifs/${id}/`, 'delete');
}

async function deleteNfsShare(id){
    return await sendRequest(`/api/v1.0/sharing/nfs/${id}/`, 'delete');
}