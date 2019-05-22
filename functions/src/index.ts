import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

export const helloAgain = functions.https.onRequest((req, res) => {
    console.log('newhello');
    res.send("Hello again from Sam.");
});

// on new room created
// populate room with owner, deck, rules
export const roomCreated = functions.firestore
    .document('test/{testId}')
    .onCreate((snap, ctx) => {
        console.log("ROOM CREATED");
        console.log(ctx.params.testId);
    });

export const testUpdate = functions.firestore
    .document('test/{testId}')
    .onUpdate((change, ctx) => {
        console.log("SOMETHING UPDATED");
        console.log(ctx.params.testId);
    });

    export const testWrite = functions.firestore
    .document('test/{testId}')
    .onWrite((change, ctx) => {
        console.log("SOMETHING WRITTEN");
        console.log(ctx.params.testId);
        return true;
    });