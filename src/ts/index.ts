import firebase, { firestore } from './functions/firebase.js';

import Player from './class/Player.js';
import AnimationManager from './class/AnimationManager.js';
import CePopUp from './elements/CePopUp.js';
import loadUntil from './functions/loadUntil.js';
import goToPage from './functions/goToPage.js';
import Deck from './class/Deck.js';
import addLoader from './functions/addLoader.js';
import CeInteractivePopUp from './elements/CeInteractivePopUp.js';
import ceLoader from './functions/ceLoader.js';
import pgLoader from './functions/pgLoader.js';
import GameHandler from './class/GameHandler.js';
import deleteAllRooms from './functions/deleteAllRooms.js';
import { Observer } from './class/Observer.js';

globalThis.deleteAllRooms = deleteAllRooms;

const DEBUG_MODE = false;

export const VERSION = `0.3.6 - alpha${DEBUG_MODE ? ' - debug' : ''}`;

// TODO detect if connected and set this accordingly
export const LOCAL_MODE = false;

export const userSignedIn = () => {
    if (firebase.apps.length == 0) return false;
    return firebase.auth().currentUser !== null;
}

let gameHandler = new GameHandler;

let observer = new Observer;

let AJAX_NAV = { prev: location.hash.replace('#', '') }

let PROVIDER_VARS = { avi: '', name: '' }

window.addEventListener('popstate', e => {
    addLoader('pageOpen');
    let nextPage = location.hash.replace('#', '');
    let pushHistory = false;

    if (nextPage == 'lobby' && AJAX_NAV.prev == 'play') {

        // Lobby throws to play, so jump back to home before it can
        history.back();

        return;
    }
})

if (!LOCAL_MODE) {
    // Initialize Firebase
    // firebase.initializeApp(firebaseConfig);

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
export const animMan = new AnimationManager;

async function popUpTest(title, message, options) {
    let p = document.body.appendChild(new CeInteractivePopUp(title, message, options));

    await p.val;
    console.log(p.val);
}

document.addEventListener('DOMContentLoaded', async function () {
    // The Firebase SDK is initialized and available here!
    await loadUntil(preload());

    let popUp = document.createElement('ce-popup') as CePopUp;
    popUp.titleTxt = `Please Note:`;
    popUp.messageTxt = `This game is still in heavy development! \n Please use the most updated Chrome to view and use it for now.\n Accounts may be lost, the app may crash, things may not display properly.\n Please send any feedback or bug reports to sam.drink.app@gmail.com'`;
    popUp.timer = 0;
    document.body.appendChild(popUp);
    popUp.show();

    if (!LOCAL_MODE) {
        firebase.auth().onAuthStateChanged(authHandler);
    } else {
        goToPage('pg-home');
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
                //@ts-ignore
                (<NodeListOf<CeAvatar>>document.querySelectorAll('ce-avatar')).forEach((v) => v.update());
                // TODO send this update correctly
                observer.send({channel:'DOMUpdate'});
                goToPage('pg-home');
            })
            .catch(e => {
                console.error('userdata.populateFrom:', e);
            })
    } else {
        // logged out
        userdata = new Player; //clear user info
        // TODO send this update correctly
        observer.send({channel:'DOMUpdate'});
        goToPage('pg-home');
    }
}



async function preload() {
    // let's try just using the cache and loading everything invisibly

    ceLoader();
    pgLoader();

    let allPromises = [];

    const fetchImg = async path => await (await fetch(path)).blob();

    let d = new Deck;

    for (let card of d.cards) {
        if (card.suit == 'joker') {
            let x = Number(card.number) % 2;
            if (x == 0) card.number = 'black';
            if (x == 1) card.number = 'red';
        }

        card.number = card.number.toLowerCase();

        allPromises.push(fetchImg(`/img/cards/${card.suit}/${card.number}.svg`))
    }

    allPromises.push(fetchImg(`/img/cards/back.svg`));

    return Promise.all(allPromises);
}

export {
    userdata,
    PROVIDER_VARS,
    gameHandler,
    observer
}