/// <reference types="firebase"/>

const VERSION = '0.0.27 - alpha';
const DEBUG_MODE = true;
const LOCAL_MODE = true;

let GAME;

let AJAX_NAV = { prev: location.hash.replace('#', '') }

let INVITE_CREDS = { room: '', pin: '' }

let PROVIDER_VARS = { avi: '', name: '' }
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

// Body sizing

document.body.style.zoom = '1';

if (window.innerWidth / window.innerHeight > 0.75 && window.innerWidth > 460) {
    document.body.style.width = `${window.innerHeight * 0.75}px`;
    document.body.style.marginLeft = `${(window.innerWidth - (window.innerHeight * 0.75)) / 2}px`;
} else {
    document.body.style.width = `${window.innerWidth}px`;
    document.body.style.marginLeft = `0px`;
}

window.addEventListener('resize', e => {
    document.body.style.height = '100vh';
    document.body.style.zoom = '1';

    if (window.innerWidth / window.innerHeight > 0.75) {
        document.body.style.width = `${window.innerHeight * 0.75}px`;
        document.body.style.marginLeft = `${(window.innerWidth - (window.innerHeight * 0.75)) / 2}px`;
    }

    let reflowElements = document.querySelectorAll('.responsive-reflow') as any;

    for (let el of reflowElements) {
        try {
            el.applyStyle();
        } catch (e) {
            console.log(e, el)
        }
    }
})

window.addEventListener('popstate', e => {
    addLoader('pageOpen');
    let nextPage = location.hash.replace('#', '');
    let pushHistory = false;

    if (nextPage == 'lobby' && AJAX_NAV.prev == 'play') {

        // Lobby throws to play, so jump back to home before it can
        history.back();

        return;
    }

    openPage(nextPage, pushHistory);

    updateDOM();
})

let firestore: any;

if (!LOCAL_MODE) {
    console.log(firebase);

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    firebase.auth().getRedirectResult().then(function (result) {
        if (result.credential) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential;

            // ...
        }
        // The signed-in user info.
        var user = result.user;

        // Grab PP

        PROVIDER_VARS.avi = user.photoURL;
        PROVIDER_VARS.name = user.displayName;
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

let userdata = new Player;
let room = new Room;

// Need issue fixed before presence
// https://github.com/firebase/firebase-js-sdk/issues/249
// let presMan: PresenceManager;

const animMan = new AnimationManager;

const palette = {
    red: `rgb(148, 75, 75)`,
    green: `rgb(75, 148, 105)`,
    blue: `rgb(0, 191, 255)`,
    darkblue: `rgb(33, 153, 249)`,
    grey: `rgb(148, 148, 148)`,
    black: `rgb(17, 17, 17)`,
    white: `rgb(240, 248, 255)`,
    greyAlpha: `rgba(0, 0, 0, 0.25)`,
    facebook: `rgb(64, 101, 179)`
}

async function popUpTest(title, message, options) {
    let p = document.body.appendChild(new CeInteractivePopUp(title, message, options));

    await p.val;
    console.log(p.val);
}



document.addEventListener('DOMContentLoaded', function () {
    // The Firebase SDK is initialized and available here!
    document.body.appendChild(new CePopUp('Please Note:',
        'This game is still in heavy development! \n Please use the most updated Chrome to view and use it for now.\n Accounts may be lost, the app may crash, things may not display properly.\n Please send any feedback or bug reports to sam.drink.app@gmail.com',
        0,
        'info'));

    // Check if we followed an invite link
    let params = (new URL(location.href)).searchParams;
    INVITE_CREDS.room = params.get('r') || '';
    INVITE_CREDS.pin = params.get('p') || '';

    if (!LOCAL_MODE) {
        firebase.auth().onAuthStateChanged(authHandler);

        firestore = firebase.firestore();
    } else {
        goToPage('ce-home-page');
    }


    // For when https://github.com/firebase/firebase-tools/issues/1001 is done
    // if (LOCAL_MODE) {
    // firestore.settings({
    //     host: 'http://localhost:8080',
    //     ssl: false
    // })
    // }

    // try {
    //     let app: any = firebase.app();
    //     let features = ['auth', 'firestore', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
    //     document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;

    // } catch (e) {
    //     console.error(e);
    //     document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    // }
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
        await userRef.set({ currentRoom: '' }, { merge: true });

        userdata.populateFrom(user.uid)
            .then(userExists => {
                if (userExists && userdata.name) {

                    // if we followed an invite link
                    if (INVITE_CREDS.room && INVITE_CREDS.pin) {
                        room.join(INVITE_CREDS.room, INVITE_CREDS.pin)
                    } else if (userData.prevRoom) {
                        console.log('joining previous room!');
                        room.join(userData.prevRoom.id, userData.prevPIN)
                    } else {
                        goToPage('ce-home-page');
                        //openPage('home');
                    }
                } else {
                    openPage('account');
                }
            })
            .catch(e => {
                console.error('userdata.populateFrom:', e);
            })

    } else {
        // logged out
        userdata = new Player; //clear user info
        openPage('login');
    }
}