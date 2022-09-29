

import  * as dialogflow from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';

const seed = {
    type: "service_account",
    project_id: "botwhats-ampx",
    private_key_id: "946cdd0ce42c2b70d0610e0150a86901406649a5",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCxFxY0TyENnDyP\nU1OczjmfI42K1/XvXEUUvS/R6QN6WBZlPVLrGAQmtuB6fSIbt6MmXH6nidEvsXYU\n9Iz4RSj6y4KZRLt7L434haTBAwqEqI1lQpVCUo+cgETVVmrpBgQb8SVnD5hiZZ9P\niqScrQYaw2FN7tgpDqdU+2+cVod7QzFlPAlwcBkrd4r9P35O0RrSQu6SrvMQ8y4D\nBeInidiybaDXsSAL2lmBMEIHppdK+FInS1JOBqJ+/+7nl9f/gmWdQlKTBknb3QnZ\nhNvxfnurolnpPYZotUwx8xuenQccI82S+2dvXnZ12Vtztk7PbcPgdHJK2ExKrR+t\nmGOnt5afAgMBAAECggEAOMyK1qQ6mb7uvZmgS77pRF2G3G1/+BHEJm63k8AE2Yy/\nQiF1IupFCpXFUgQomHNB5N/tz5aofX+RvA7j2A12o1n6vWYKK+yIwJk8yptLGFln\nYH8GmIsafLu3WCWrjKndT4j80h1yZrzpZ/2z5nyoZJUd9H0S37hPezZaCe7G7YWJ\nT3IComXAjrOng7jEHZYicZ3MWDPJWiqsDl1S0oNRwNxVSdEtJ6ILhayI1NPLBWu3\nie19kwHvGzxsXfbVkG9j9z447A4Os3xVuEWZySVDa46Tid5WauM4j+OtmABLHnRn\nMbhNSESQOezzBc/oU6LAr9mbTYlvcDMpP5X7idJioQKBgQD55o8DVn1W4klvT610\npfGRzVmmgjRK5KkQMhh33Kqe4uDSoBOpg6DLn7W1KuHEyyVRrYbqVAQP0+nf0GgO\nEh+kKWUN5WgFy7xgpPnuZslD+70t7sgszDW9ppMsMoE4N+FNuLanBj3aeVChaeZx\nN6kVkiuGrPjcIrV6uNsBzp0l3QKBgQC1aZcgD8+M41yzrZEpr5GKlMPkkBy26Pbi\nIIMBjl2XMjjkKWiq/Sbbld8eBJxK9T504ryRq8doE6KoICj5bw4I1mOfpqoR9vQS\nU2/Er04H/A/biytZAwZDC9WpnevueXsvJ2QvbSX2RlLicEYSdGl7RNrVabCDYPtH\nx0wtlCW8qwKBgQCXT/UULlBiRU31qib61Ge6wr4fxgLnviBoAA00tlZRMkqy/d4p\n69t2r9OUSMy/HcoQ9KMWS5zSAJxBuqzmqC6kdbQMf/VGXSBI3FvA8Fe5ZDoeD9EA\n3v1DQhMm1cXMRnmTV96wr2TQXlhmA/tWXj9xIjpcp2tfz1xXXIqvQ21/uQKBgAwk\nDuskY72IEdIskYR6rYDax+lqA6HyIWOszVezUWwm/ku2wbx/yLP1acM2h8c0doOY\nEQqmtmeuuLoLvPJEjmnk/zHWE5e0MU1wrBA7szsxkVYeED6axzaBekEpwnppQuc6\n+ad65ImA11c0MFxX0h9f0k1qD1gbi3WYTu7V9ViVAoGAXbE4RzreggvHcMpkRY4b\nrkppifPXzF9mvE4cpyjbJsSSqgwFkNI731EAlII8DPjrFtcWZr2LTV+ytoaaBBev\nAT8870YESBzsgGr+i3N8arYsUou7F/vFZrgWOst5q8/pKh3MfVA7BUQW+BKr/lpJ\ngY5veuGlJlelgWvNY1Sacm4=\n-----END PRIVATE KEY-----\n",
    client_email: "botwhats@botwhats-ampx.iam.gserviceaccount.com",
    client_id: "118078779771093391372",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/botwhats%40botwhats-ampx.iam.gserviceaccount.com"
}


export const runSample = async ( message ) => {
    // A unique identifier for the given session
    const sessionId = uuidv4();

    const configuration = {
        credentials: {
            private_key: seed.private_key,
            client_email: seed.client_email
        }
    };

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient(configuration);
    // const sessionPath = sessionClient.projectAgentSessionPath(
    //     projectId = seed.project_id,
    //     sessionId
    // );

    const sessionPath = sessionClient.projectAgentSessionPath(
        seed.project_id,
        sessionId,
    );

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
        text: {
            // The query to send to the dialogflow agent
            text: message,
            // The language used by the client (en-US)
            languageCode: 'es-MX',
        },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
    } else {
        console.log('  No intent matched.');
    }

    return result.fulfillmentText;

}
