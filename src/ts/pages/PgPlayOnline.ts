import firebase from '../functions/firebase.js';
import goToPage from "../functions/goToPage.js";
import errorPopUp from "../functions/errorPopUp.js";
import Page from "./Page.js";

import { gameHandler } from '../index.js';
import disablePage from '../functions/disablePage.js';

export default class PgPlayOnline extends Page {
    constructor() {
        super();
        this.header = 'account';
    }

    async connectedCallback() {
        await super.connectedCallback();

        // check if not signed in; redirect to login if not
        if (firebase.auth().currentUser === null) {
            goToPage('pg-login');
        }

        // add elements to page

        let roomInput = document.createElement('input');
        roomInput.id = 'room-input';
        roomInput.classList.add('big');
        let roomLabel = document.createElement('p');
        roomLabel.classList.add('big', 'label');
        roomLabel.textContent = 'Room ID:';

        this.shadowRoot.appendChild(roomLabel);
        this.shadowRoot.appendChild(roomInput);

        let pinInput = document.createElement('input');
        pinInput.id = 'pin-input';
        pinInput.classList.add('big');
        let pinLabel = document.createElement('p');
        pinLabel.classList.add('big', 'label');
        pinLabel.textContent = 'Room PIN:';

        this.shadowRoot.appendChild(pinLabel);
        this.shadowRoot.appendChild(pinInput);


        let joinButton = document.createElement('button');
        joinButton.textContent = 'Join Room';

        joinButton.addEventListener('click', e => {
            console.log('Join button pressed!');
            gameHandler.type = 'ring-of-fire';
            gameHandler.online = true;
            gameHandler.gameObject.roomId = roomInput.value.toUpperCase();
            gameHandler.gameObject.pin = pinInput.value;
            gameHandler.gameObject.initOnline(false)
                .then(roomJoined => {
                    if (roomJoined.joined) {
                        goToPage('pg-setup-game');
                    } else {
                        errorPopUp(roomJoined.error.err);
                    }
                })
        });

        joinButton.classList.add('big');

        this.shadowRoot.appendChild(joinButton);

        let createButton = document.createElement('button');
        createButton.textContent = 'Create Room';

        createButton.addEventListener('click', async function (e) {
            disablePage();
            console.log('Create button pressed!');

            gameHandler.online = true;
            goToPage('pg-game-select');
        });

        createButton.classList.add('big', 'green');

        this.shadowRoot.appendChild(createButton);


        let backButton = document.createElement('button');
        backButton.textContent = 'Back';

        backButton.addEventListener('click', async function (e) {
            disablePage();
            console.log('Back button pressed!');
            goToPage('pg-home');
        });

        backButton.classList.add('big', 'red');

        this.shadowRoot.appendChild(backButton);
    }
}

