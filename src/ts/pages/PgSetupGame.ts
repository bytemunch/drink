import CeCreatePlayerMenu from "../elements/CeCreatePlayerMenu.js";
import goToPage from "../functions/goToPage.js";
import Page from "./Page.js";

import {gameHandler} from '../index.js';

export default class PgSetupGame extends Page {
    constructor() {
        super();
        this.header = 'account';
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();
        // add elements to page
        // Player config bits!!
        let createPlayer = new CeCreatePlayerMenu;
        this.appendChild(createPlayer);

        let playerInfo = document.createElement('ce-player-list');
        playerInfo.classList.add('bigGrid');
        this.appendChild(playerInfo);

        let startButton = document.createElement('button');
        startButton.textContent = 'Start';

        startButton.addEventListener('click', e => {
            goToPage(`pg-play-${gameHandler.gameObject.type}`);
        });

        startButton.classList.add('big','green');

        this.appendChild(startButton);

        let backButton = document.createElement('button');
        backButton.textContent = 'Back';

        backButton.addEventListener('click', e => {
            console.log('Back button pressed!');
            goToPage('pg-home');
        });

        backButton.classList.add('big','red', 'bottom');

        this.appendChild(backButton);
    }
}