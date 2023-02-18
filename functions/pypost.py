from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibmcloudant.cloudant_v1 import CloudantV1
from ibm_cloud_sdk_core import ApiException


def formResponse(statusCode, body):
    return {
        "statusCode": statusCode,
        "headers": {"Content-Type": "application/json"},
        "body": body
    }


def main(dict):
    secret = {
        "COUCH_URL":
        "https://apikey-v2-2cyywmxlsaahl54fgbjm13d9xih7m61lg3ce16n5m9zd:2ebb1cd25e6d93cb8547ffe3f45fd6d4@21e59688-0d81-4ced-aee6-ffaddc42b6e7-bluemix.cloudantnosqldb.appdomain.cloud",
        "COUCH_USERNAME": "apikey-v2-2cyywmxlsaahl54fgbjm13d9xih7m61lg3ce16n5m9zd",
        "IAM_API_KEY": "422oU7w-BuGlBjsnxjwFyGYVIuXebrPhdjWIWVfyAwBw"
    }
    authenticator = IAMAuthenticator(
        secret["IAM_API_KEY"])
    service = CloudantV1(authenticator=authenticator)
    service.set_service_url(secret["COUCH_URL"])

    try:
        selector = {"dealership": {"$eq": int(dict["dealerId"])}}
        response = service.post_find(
            db="reviews",
            selector=selector
        ).get_result()
        if (len(response["docs"]) == 0):
            return formResponse(404, response)
        else:
            return formResponse(200, response)
    except ApiException as ae:
        errorBody = {"error": ae.message}
        if ("reason" in ae.http_response.json()):
            errorBody["reason"] = ae.http_response.json()["reason"]
        return formResponse(int(ae.code), errorBody)
    except:
        return formResponse(500, {"error": "Something went wrong on the server"})


main({"dealerId": 15})