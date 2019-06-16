/// <reference types="firebase"/>

const DEBUG_MODE = true;

let userdata = new UserData;
let room = new Room;

let updater = new Event('update');

let loadMan = new LoadMan;

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
        let features = ['auth', 'firestore', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
        document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;

    } catch (e) {
        console.error(e);
        document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }
});

function errorPopUp(msg,timer=0) {
    document.body.appendChild(new CePopUp('Error!', msg, timer, 'error'));
}

function updateDOM() {
    // console.log('updateDom: Started...')
    const elements = document.querySelectorAll('.updateable-element');
    elements.forEach(element=>{
        const castElement = element as UpdateableElement;
        castElement.update();
    })
}

function openPage(name: string) {
    let page: Page;

    switch (name) {
        case 'login':
            page = new LoginPage();
            break;
        case 'home':
            page = new HomePage();
            break;
        case 'account':
            page = new AccountPage();
            break;
        case 'lobby':
            page = new LobbyPage();
            break;
        case 'play':
            page = new PlayPage();
            break;
        case 'finished':
            page = new GameOverPage();
            break;
        default:
            console.log(`Page ${name} not found!`);
            return;
    }

    let pageContainer = document.querySelector('#page');
    if (!pageContainer) {
        pageContainer = document.createElement('div');
        pageContainer.setAttribute('id','page');
        document.querySelector('#app').appendChild(pageContainer)
    }

    pageContainer.innerHTML = '';
    pageContainer.appendChild(page.page);
    loadMan.killLoader('pageOpen')

}


async function authHandler(user: any) {
    loadMan.killLoader('initialLoad')
    loadMan.addLoader('pageOpen')
    if (user) {
        // logged in
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


async function easyPOST(fn: string, data: any) {
    return fetch(`https://us-central1-ring-of-fire-5d1a4.cloudfunctions.net/${fn}`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data)
    })
}

async function deleteAllRooms() {
    db.collection('rooms').get().then(qSnap => {
        qSnap.forEach(doc => {
            if (doc.id !== 'roomsinfo') console.log(doc.ref.delete());
        })
    })
}

let topbar = new Topbar;

document.querySelector('#app').appendChild(topbar.html);