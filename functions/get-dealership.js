/**
 * Get all dealerships or filtered dealerships by state
 */

const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

function main(params) {

    const authenticator = new IamAuthenticator({ apikey: params.IAM_API_KEY })
    const cloudant = CloudantV1.newInstance({
        authenticator: authenticator
    });
    cloudant.setServiceUrl(params.COUCH_URL);

    // Parse state from query parameter
    const state = params.state;

    let dbListPromise;
    if (state) {
        // Get filtered dealerships by state
        dbListPromise = getMatchingRecords(cloudant, 'dealerships', { state: state });
    } else {
        // Get all dealerships
        dbListPromise = getAllRecords(cloudant, 'dealerships');
    }

    return dbListPromise;
}

function getMatchingRecords(cloudant, dbname, selector) {
    return new Promise((resolve, reject) => {
        cloudant.postFind({ db: dbname, selector: selector })
            .then((result) => {
                resolve({ result: result.result.docs });
            })
            .catch(err => {
                console.log(err);
                reject({ err: err });
            });
    })
}


/*
Sample implementation to get all the records in a db.
*/
function getAllRecords(cloudant, dbname) {
    return new Promise((resolve, reject) => {
        cloudant.postAllDocs({ db: dbname, includeDocs: true, limit: 10 })
            .then((result) => {
                resolve({ result: result.result.rows });
            })
            .catch(err => {
                console.log(err);
                reject({ err: err });
            });
    })
}
