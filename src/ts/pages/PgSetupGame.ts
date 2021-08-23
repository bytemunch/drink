import CeCreatePlayerMenu from "../elements/CeCreatePlayerMenu.js";
import goToPage from "../functions/goToPage.js";
import Page from "./Page.js";

import { gameHandler } from '../index.js';
import disablePage from "../functions/disablePage.js";
import CeCreatePlayerButton from "../elements/CeCreatePlayerButton.js";

export default class PgSetupGame extends Page {
    constructor() {
        super();
        this.header = 'account';
    }

    async connectedCallback() {
        await super.connectedCallback();
        // add elements to page
        // Player config bits!!
        let createPlayer = new CeCreatePlayerMenu;
        this.shadowRoot.appendChild(createPlayer);

        let playerInfo = document.createElement('ce-player-list');
        playerInfo.classList.add('bigGrid');
        this.shadowRoot.appendChild(playerInfo);

        let createPlayerBtn = new CeCreatePlayerButton(createPlayer);
        this.shadowRoot.appendChild(createPlayerBtn);

        let startButton = document.createElement('button');
        startButton.textContent = 'Start';

        startButton.addEventListener('click', async function (e) {
            disablePage();
            gameHandler.gameObject.state = 'playing';
            goToPage(`pg-play-${gameHandler.gameObject.type}`);
        });

        startButton.classList.add('big', 'green');

        this.shadowRoot.appendChild(startButton);

        let backButton = document.createElement('button');
        backButton.textContent = 'Back';

        backButton.addEventListener('click', async function (e) {
            disablePage();
            console.log('Back button pressed!');
            goToPage('pg-home');
        });

        backButton.classList.add('big', 'red', 'bottom');

        this.shadowRoot.appendChild(backButton);
    }
}