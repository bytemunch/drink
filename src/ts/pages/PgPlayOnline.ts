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

        let roomInput = this.shadowRoot.querySelector('#room-input') as HTMLInputElement;
        let pinInput = this.shadowRoot.querySelector('#pin-input') as HTMLInputElement;

        let joinButton = this.shadowRoot.querySelector('#join-button');

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

        let createButton = this.shadowRoot.querySelector('#create-button');

        createButton.addEventListener('click', async function (e) {
            disablePage();
            console.log('Create button pressed!');

            gameHandler.online = true;
            goToPage('pg-game-select');
        });

        let backButton = this.shadowRoot.querySelector('#back-button');
        backButton.addEventListener('click', async function (e) {
            disablePage();
            console.log('Back button pressed!');
            goToPage('pg-home');
        });

    }
}

