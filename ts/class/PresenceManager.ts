class PresenceManager {
    presenceListener;
    ref;

    // Why write code when the docs did it for you?
    // Wait why not implement the functionality instead of writing a workaround doc? 🤔
    constructor(uid) {
        // Create a reference to this user's specific status node.
        // This is where we will store data about being online/offline.
        const userStatusDatabaseRef = firebase.database().ref('/status/' + uid);

        // We'll create two constants which we will write to 
        // the Realtime database when this device is offline
        // or online.
        const isOfflineForDatabase = {
            state: 'offline',
            last_changed: firebase.database.ServerValue.TIMESTAMP,
        };

        const isOnlineForDatabase = {
            state: 'online',
            last_changed: firebase.database.ServerValue.TIMESTAMP,
        };

        const userStatusFirestoreRef = firebase.firestore().doc('/status/' + uid);
        this.ref = userStatusFirestoreRef;

        // Firestore uses a different server timestamp value, so we'll 
        // create two more constants for Firestore state.
        const isOfflineForFirestore = {
            state: 'offline',
            last_changed: firebase.firestore.FieldValue.serverTimestamp(),
        };

        const isOnlineForFirestore = {
            state: 'online',
            last_changed: firebase.firestore.FieldValue.serverTimestamp(),
        };

        // Create a reference to the special '.info/connected' path in 
        // Realtime Database. This path returns `true` when connected
        // and `false` when disconnected.

        // If we are currently connected, then use the 'onDisconnect()' 
        // method to add a set which will only trigger once this 
        // client has disconnected by closing the app, 
        // losing internet, or any other means.
        firebase.database().ref('.info/connected').on('value', function (snapshot) {
            if (snapshot.val() == false) {
                // Instead of simply returning, we'll also set Firestore's state
                // to 'offline'. This ensures that our Firestore cache is aware
                // of the switch to 'offline.'
                userStatusFirestoreRef.set(isOfflineForFirestore);
                return;
            };

            userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
                // The promise returned from .onDisconnect().set() will
                // resolve as soon as the server acknowledges the onDisconnect() 
                // request, NOT once we've actually disconnected:
                // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

                // We can now safely set ourselves as 'online' knowing that the
                // server will mark us as offline once we lose connection.
                userStatusDatabaseRef.set(isOnlineForDatabase);

                // We'll also add Firestore set here for when we come online.
                userStatusFirestoreRef.set(isOnlineForFirestore);
            });
        });

        this.presenceListener = userStatusFirestoreRef.onSnapshot(function(doc) {
            var isOnline = doc.data().state == 'online';
            // ... use isOnline
            //console.log('presMan:',isOnline)
            if (!isOnline) errorPopUp('Offlined!')
        });
    }
}