/// <reference types="firebase"/>

const DEBUG_MODE = false;

const VERSION = `0.3.6 - alpha${DEBUG_MODE ? ' - debug' : ''}`;

const palette = {
    red: `rgb(148, 75, 75)`,
    green: `rgb(75, 148, 105)`,
    blue: `rgb(0, 191, 255)`,
    darkblue: `rgb(33, 153, 249)`,
    grey: `rgb(148, 148, 148)`,
    black: `rgb(17, 17, 17)`,
    white: `rgb(240, 248, 255)`,
    greyAlpha: `rgba(0, 0, 0, 0.25)`,
    facebook: `rgb(64, 101, 179)`,
    purple: `rgb(142, 77, 216)`
}

const rgb2hex = (rgb: string) => '#' + rgb.replace(/[rgba\(\)\ ]/g, '').split(',').splice(0, 3).map(d => { const h = Number(d).toString(16); return h.length == 1 ? `0${h}` : h; }).join('');


// TODO detect if connected and set this accordingly
const LOCAL_MODE = false;

const userSignedIn = () => {
    if (firebase.apps.length == 0) return false;
    return firebase.auth().currentUser !== null;
}

let GAME: Game | RingOfFire | RedOrBlack;

const TEMP_MS_BETWEEN_TURNS = 1500;
let TEMP_WAIT_FOR_TURN = false;

let GAME_CHANGE_LISTENER = function () { console.log('no listener') };

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

document.body.style.zoom = '1';

window.addEventListener('popstate', e => {
    addLoader('pageOpen');
    let nextPage = location.hash.replace('#', '');
    let pushHistory = false;

    if (nextPage == 'lobby' && AJAX_NAV.prev == 'play') {

        // Lobby throws to play, so jump back to home before it can
        history.back();

        return;
    }

    updateDOM();
})

let firestore: any;

if (!LOCAL_MODE) {
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

// Need issue fixed before presence
// https://github.com/firebase/firebase-js-sdk/issues/249
// let presMan: PresenceManager;

const animMan = new AnimationManager;

async function popUpTest(title, message, options) {
    let p = document.body.appendChild(new CeInteractivePopUp(title, message, options));

    await p.val;
    console.log(p.val);
}

document.addEventListener('DOMContentLoaded', async function () {
    // The Firebase SDK is initialized and available here!
    document.body.appendChild(new CePopUp('Please Note:',
        'This game is still in heavy development! \n Please use the most updated Chrome to view and use it for now.\n Accounts may be lost, the app may crash, things may not display properly.\n Please send any feedback or bug reports to sam.drink.app@gmail.com',
        0,
        'info'));

    await loadUntil(preload());

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
});

async function authHandler(user: any) {
    if (user) {
        // logged in

        // get user ref
        const userRef = await firestore.collection('users').doc(user.uid);
        const userDoc = await userRef.get();

        userdata.populateFrom(user.uid)
            .then(() => {
                (<NodeListOf<CeAvatar>>document.querySelectorAll('ce-avatar')).forEach((v) => v.update());
                updateDOM();
                goToPage('ce-home-page');

            })
            .catch(e => {
                console.error('userdata.populateFrom:', e);
            })
    } else {
        // logged out
        userdata = new Player; //clear user info
        updateDOM();
        goToPage('ce-home-page');
    }
}

async function preload() {
    // let's try just using the cache and loading everything invisibly

    // let pl = document.createElement('div');
    // pl.style.display == 'none';
    // pl.id = 'asset-preload';

    let allPromises = [];

    const fetchImg = async path => await (await fetch(path)).blob();

    let d = new Deck;

    for (let card of d.cards) {
        if (card.suit == 'joker') {
            let x = Number(card.number) % 2;
            if (x == 0) card.number = 'black';
            if (x == 1) card.number = 'red';
            //if (x == 2) number = 'white';
        }

        card.number = card.number.toLowerCase();

        allPromises.push(fetchImg(`/img/cards/${card.suit}/${card.number}.svg`))
        // allPromises.push((await fetch()).blob());
    }

    allPromises.push(fetchImg(`/img/cards/back.svg`));

    // document.body.appendChild(pl);


    return Promise.all(allPromises);
}