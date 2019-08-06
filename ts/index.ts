/// <reference types="firebase"/>

const VERSION = '0.0.10 - alpha - ';
const DEBUG_MODE = true;
const LOCAL_MODE = false;
// Local mode is gonna wait til alpha release
// or maybe use DEBUG_MODE to switch between dev project and live project
// Literally https://github.com/firebase/firebase-tools/issues/1001
// cannot come soon enough argh

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOLi_ZqoVClSIAjV7eylNRagNtEp6tW-Q",
    authDomain: "ring-of-fire-5d1a4.firebaseapp.com",
    databaseURL: "https://ring-of-fire-5d1a4.firebaseio.com",
    projectId: "ring-of-fire-5d1a4",
    storageBucket: "ring-of-fire-5d1a4.appspot.com",
    messagingSenderId: "65675668525",
    appId: "1:65675668525:web:e6865bb78d7596c7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let userdata = new UserData;
let room = new Room;

let presMan: PresenceManager;

const animMan = new AnimationManager;

let firestore: any;

document.body.appendChild(new CeLoadScreen('initialLoad'));

const palette = {
    red: `rgb(148, 75, 75)`,
    green: `rgb(75, 148, 105)`,
    blue: `rgb(0, 191, 255)`,
    darkblue: `rgb(33, 153, 249)`,
    grey: `rgb(148, 148, 148)`,
    white: `rgb(240, 248, 255)`,
    greyAlpha: `rgba(0, 0, 0, 0.25)`
}

document.addEventListener('DOMContentLoaded', function () {
    // The Firebase SDK is initialized and available here!
    document.body.appendChild(new CePopUp('Please Note:',
        'This game is still in heavy development! \n Please use Chrome to view and use it for now.\n Accounts may be lost, the app may crash, things may not display properly.\n Please send any feedback or bug reports to sam.drink.app@gmail.com',
        0,
        'info'));

    firebase.auth().onAuthStateChanged(authHandler);

    firestore = firebase.firestore();

    // For when https://github.com/firebase/firebase-tools/issues/1001 is done
    // if (LOCAL_MODE) {
    // firestore.settings({
    //     host: 'http://localhost:8080',
    //     ssl: false
    // })
    // }

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
    killLoader('initialLoad')
    addLoader('pageOpen')
    if (user) {
        // logged in

        // get user ref
        const userRef = await firestore.collection('users').doc(user.uid);
        const userDoc = await userRef.get();
        const userData = await userDoc.data();

        // clear user's current room if any
        console.log('clearing room');
        await userRef.set({ currentRoom: '' }, { merge: true });

        // setup presence
        presMan = new PresenceManager(user.uid);
        userdata.populateFrom(user.uid)
            .then(userExists => {
                if (userExists && userdata.name) {
                    if (userData.prevRoom) {
                        console.log('joining previous room!');
                        room.join(userData.prevRoom.id, userData.prevPIN)
                    } else {
                        openPage('home');
                    }
                } else {
                    openPage('account');
                }
            })
            .catch(e => {
                console.error(e);
            })

    } else {
        // logged out
        userdata = new UserData; //clear user info
        openPage('login');
    }
}