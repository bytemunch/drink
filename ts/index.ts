/// <reference types="firebase"/>

const DEBUG_MODE = true;

let userdata = new UserData;
let room = new Room;

let updater = new Event('update');

let loadMan = new LoadManager;

let presMan: PresenceManager;

let db: any;

loadMan.addLoader('initialLoad');

const palette = {
    red: `rgb(148, 75, 75)`,
    green: `rgb(75, 148, 105)`,
    blue: `rgb(0, 191, 255)`,
    grey: `rgb(148, 148, 148)`,
    white: `rgb(240, 248, 255)`
}

document.addEventListener('DOMContentLoaded', function () {
    //console.log('DOMLoaded');
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    firebase.auth().onAuthStateChanged(authHandler);

    db = firebase.firestore();

    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    try {
        let app: any = firebase.app();
        let features = ['auth', 'firestore', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
        document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;

    } catch (e) {
        console.error(e);
        document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }
});

async function authHandler(user: any) {
    loadMan.killLoader('initialLoad')
    loadMan.addLoader('pageOpen')
    if (user) {
        // logged in
        // setup presence
        presMan = new PresenceManager(user.uid);
        userdata.populateFrom(user.uid)
            .then(userExists => {
                userExists && userdata.name ? openPage('home') : openPage('account')
            },
                e => { console.error(e) });
    } else {
        // logged out
        userdata = new UserData; //clear user info
        openPage('login');
    }
}