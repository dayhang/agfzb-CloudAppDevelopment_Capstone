/**
 * Get all dealerships for a given state
 */

const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

function main(params) {

    const authenticator = new IamAuthenticator({ apikey: params.IAM_API_KEY })
    const cloudant = CloudantV1.newInstance({
      authenticator: authenticator
    });
    cloudant.setServiceUrl(params.COUCH_URL);

    let dbListPromise = getDbs(cloudant);
    return dbListPromise.then(result => {
        const dealershipDBName = "dealerships";
        let state = params.state;
        let selector = {};
        if (state) {
            selector = {
                "state": state
            }
        }
        return getMatchingRecords(cloudant, dealershipDBName, selector).then(result => {
            return { dealerships: result.result };
        }).catch(error => {
            console.log(error);
            return { error: error };
        });
    }).catch(error => {
        console.log(error);
        return { error: error };
    });
}

function getDbs(cloudant) {
     return new Promise((resolve, reject) => {
         cloudant.getAllDbs()
             .then(body => {
                 resolve({ dbs: body.result });
             })
             .catch(err => {
                  console.log(err);
                 reject({ err: err });
             });
     });
 }

 
 /*
 Sample implementation to get the records in a db based on a selector. If selector is empty, it returns all records. 
 eg: selector = {state:"Texas"} - Will return all records which has value 'Texas' in the column 'State'
 */
 function getMatchingRecords(cloudant, dbname, selector) {
     return new Promise((resolve, reject) => {
         cloudant.postFind({ db: dbname, selector: selector })
             .then((result) => {
               resolve({ result: result.result.docs });
             })
             .catch(err => {
                console.log(err);
                reject({ error: err });
             });
          });
 }
 
                        
 /*
 Sample implementation to get all the records in a db.
 */
 function getAllRecords(cloudant, dbname) {
     return new Promise((resolve, reject) => {
         cloudant.postAllDocs({ db: dbname, includeDocs: true, limit: 10 })            
             .then((result)=>{
               resolve({result:result.result.rows});
             })
             .catch(err => {
                console.log(err);
                reject({ error: err });
             });
         });
 }

 //URL should be in the format: https://us-south.functions.appdomain.cloud/api/v1/web/37a9676c-9962-404e-9db0-7a3742823121/dealership-package/get-dealership.json?state=California
//Keep in mind to add get-dealership.json. Need must include .json when the url does not open properly.