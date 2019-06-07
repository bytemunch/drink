/// <reference types="firebase"/>

const DEBUG_MODE = true;

let userdata = new UserData;
let room = new Room;

let updater = new Event('update');

let loadMan = new LoadMan;

let db: any;

loadMan.addLoader('initialLoad');


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
        default:
            console.log(`Page ${name} not found!`);
            return;
    }

    // side effects here hmmmmm

    let appContainer = document.querySelector('#app');
    appContainer.innerHTML = "";
    appContainer.appendChild(page.page);
}


async function authHandler(user: any) {
    if (user) {
        // logged in
        userdata.populateFrom(user.uid)
            .then(userExists => { userExists && userdata.name ? openPage('home') : openPage('account') },
                e => { console.error(e) });
    } else {
        // logged out
        userdata = new UserData; //clear user info
        openPage('login');
    }

    loadMan.killLoader('initialLoad')
}

async function getRoomId(len: number = 4) {
    const roomsinfo = await db.collection('rooms').doc('roomsinfo').get()
        .then(doc => {
            if (doc.exists) {
                return doc.data();
            } else {
                return doc.ref.set({ roomcount: 0 })
                    .then((e) => { return e })
            }
        })

    function createId(len) {
        let str = '';
        for (let i = 0; i < len; i++) {
            str = str + String.fromCharCode(Math.ceil((Math.random()) * 26) + 64);
        }
        // return 'test';
        return str;
    }

    let newRoomId = createId(len);
    let breakCounter = 0;

    while ((roomsinfo.roomlist[newRoomId] != undefined) && (roomsinfo.roomlist[newRoomId] != false) && (breakCounter < 26 ** len)) {
        newRoomId = createId(len);
        breakCounter++;
    }

    if (breakCounter >= 26 ** len) {
        //randomness has failed us!
        // TODO sequentially check for available rooms here
        return Promise.reject('Room slots full!')
    }

    return newRoomId;
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