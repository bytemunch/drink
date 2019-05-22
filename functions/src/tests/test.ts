const firebase = require('@firebase/testing');

const app = firebase.initializeTestApp({
    projectId: "my-test-project",
    auth: { uid: "alice", email: "alice@example.com" }
});

const admin = firebase.initializeAdminApp({ projectId: "my-test-project" });

admin.firestore().collection('test').doc('abcd').set({a:'b'})
.then(ref=>{return admin.firestore().collection('test').doc('abcd').set({a:'c'})})
.then(ref=>{return app.firestore().collection('test').doc('abcd').get()})
.then(r=>console.log(r.data()))


console.log('testing.....');