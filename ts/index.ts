/// <reference types="firebase"/>

let userdata = new UserData;
let roomdata = new RoomData;

let db: any;

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

        // console.log(user);

        userdata.populateFrom(user.uid)
            .then(userExists => { userExists && userdata.name ? openPage('home') : openPage('account') },
                e => { console.error(e) });
    } else {
        // logged out
        userdata = new UserData; //clear user info
        openPage('login');
    }
}

async function joinRoom(roomId: string, roomPass: string) {
    console.log(`TODO join room function. ID:${roomId} PW:${roomPass}`);
    // attempt to write user info to room
    // cloud function returns acceptance/rejection
    // > acceptance is in for of room info, we then set up a live listen to updates in room
    // > rejection is null, error out here
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

async function rCreateRoom() {
    const roomId = await getRoomId().catch(e => console.error(e));

    return firebase.auth().currentUser.getIdToken(true)
        .then(token => {
            return easyPOST('createRoom', { token, roomId })
        })
        .then(res => res.json())
    // .then(data => console.log(data))

    // TODO after room created success start listening to changes on room ref
    // When changes detected grab PIN as we should be owner
    // Then go ahead and join the room
}

async function requestJoinRoom(roomId: string, pin: string) {
    // REFAC put this in the userdata class?
    if (!roomId) return Promise.reject('requestJoinRoom: No Room ID provided!');
    if (!pin) return Promise.reject('requestJoinRoom: No Room PIN provided!');

    firebase.auth().currentUser.getIdToken(true)
        .then(token => {
            // Send data to cloud function to compare PIN
            easyPOST('joinRoom', { pin, roomId, token })
                .then(res => { return res.json() })
                .then(data => {
                    if (!data.joined) {
                        return Promise.reject(data.error);
                    }
                    roomdata.init(roomId); //TODO promisify init
                    return Promise.resolve();
                })
                .then(() => {
                    // RoomData is initialised here

                })
                .catch(e => {
                    console.error(e);
                    let unsubscribe = db.collection('rooms').doc(roomId)
                        .onSnapshot(change=>{
                            let state = change.data().state
                            if (state && state == 'lobby') {
                                requestJoinRoom(roomId,pin);
                                unsubscribe();
                            }
                        })
                });
        })

    // TODO rate limiting to prevent bruteforce room entry
    // as it would only take 26^4*10000 attempts to find any single room + pin
    // also even pentesting that would far exceed my quotas
    // i need a revenue stream fffffffffffffff

    // TODO setup security to prevent room snooping from non owners
    // > and people that haven't joined yet

}

async function deleteAllRooms() {
    db.collection('rooms').get().then(qSnap => {
        qSnap.forEach(doc => {
            if (doc.id !== 'roomsinfo') console.log(doc.ref.delete());
        })
    })
}