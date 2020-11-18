const { FusionAuthClient } = require('fusionauth-node-client');
const client = new FusionAuthClient(
    'Y_U8gxK1zmw0E0EUq5zvuv87JPIu-CdVdUNHKVUK0DYzVQu1e3v7HLid',
    'http://localhost:9011'
);

// Retrieve User by Email Address
client.retrieveUserByEmail('khangdohuu.vccb@gmail.com')
    .then(handleResponse);

function handleResponse(clientResponse) {
    console.info(JSON.stringify(
        clientResponse.successResponse.user, null, 2));
}