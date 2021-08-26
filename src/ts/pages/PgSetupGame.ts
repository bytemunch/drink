import goToPage from "../functions/goToPage.js";
import Page from "./Page.js";

import { gameHandler } from '../index.js';
import disablePage from "../functions/disablePage.js";
import CeShowButton from "../elements/CeShowButton.js";

export default class PgSetupGame extends Page {
    constructor() {
        super();
        this.header = 'account';
    }

    async connectedCallback() {
        await super.connectedCallback();

        let createPlayerBtn = this.shadowRoot.querySelector('#create-player-button') as CeShowButton;
        createPlayerBtn.img = './img/add.svg';
        createPlayerBtn.target = this.shadowRoot.querySelector('ce-create-player-menu');

        let startButton = this.shadowRoot.querySelector('#start-button');

        startButton.addEventListener('click', async function (e) {
            disablePage();
            gameHandler.gameObject.state = 'playing';
            gameHandler.gameObject.batchFirebase({state: gameHandler.gameObject.state});
            goToPage(`pg-play-${gameHandler.gameObject.type}`);
        });

        let backButton = this.shadowRoot.querySelector('#back-button');

        backButton.addEventListener('click', async function (e) {
            disablePage();
            console.log('Back button pressed!');
            goToPage('pg-home');
        });

        this.applyStyle();
    }
}