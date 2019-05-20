/// <reference types="firebase"/>

let userdata = new UserData;

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