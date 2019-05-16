/// <reference types="firebase"/>


let userdata: any = {};

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
        // console.log(user);

        // Pull user data into memory
        await db.collection("users").doc(user.uid).get().then((doc: { id: any; data: { (): void; (): void; }; }) => {
            userdata.uid = doc.id;

            let retrievedData:any = doc.data();

            for (let field in retrievedData) {
                userdata[field] = retrievedData[field];
            }
            // userdata = doc.data();
        })
        openPage('home');
    } else {
        userdata = {  }; //clear user info
        openPage('login');
    }
}