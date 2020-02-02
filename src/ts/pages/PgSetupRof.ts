
import CePlayerList from '../elements/CePlayerList.js';
import firebase from '../functions/firebase.js';
import errorPopUp from '../functions/errorPopUp.js';
import Page from './Page.js';

import {userdata, gameHandler} from '../index.js';

let firestore = firebase.firestore();
export default class PgSetupRof extends Page {

    constructor() {
        super();
        this.header = 'account';
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();
        // add elements to page

        // Room ID
        let roomId = document.createElement('h3');
        roomId.textContent = 'Room: '+gameHandler.gameObject.roomId;
        this.appendChild(roomId);

        // Room PIN
        let roomPin = document.createElement('h3');
        roomPin.textContent = 'Pin: '+gameHandler.gameObject.pin;
        this.appendChild(roomPin);

        // Players
        let playerList = new CePlayerList;
        playerList.classList.add('bigGrid')
        this.appendChild(playerList);

        // Start/Ready button

        let startButton = document.createElement('button');
        startButton.textContent = 'Start Game';

        startButton.addEventListener('click', async e => {
            // TODO if we are room owner
            // set state to playing
            if (gameHandler.gameObject.ownerUid === userdata.uid) {
                await firestore.collection('rooms').doc(gameHandler.gameObject.roomId).set({state: 'playing'},{merge:true});
            } else {
                errorPopUp('Only room owner can start the game! Current room owner is '+gameHandler.gameObject.players[gameHandler.gameObject.ownerUid].name);
            }
        });

        startButton.classList.add('big','green');

        this.appendChild(startButton);
    }
}