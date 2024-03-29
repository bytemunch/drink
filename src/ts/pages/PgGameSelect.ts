import Page from "./Page.js";
import goToPage from "../functions/goToPage.js";

import { gameHandler } from '../index.js';
import disablePage from "../functions/disablePage.js";

export default class PgGameSelect extends Page {
    constructor() {
        super();
        this.header = 'account';
    }

    async connectedCallback() {
        await super.connectedCallback();
        // add elements to page

        let rofButton = document.createElement('button');
        rofButton.textContent = 'Ring of Fire';

        rofButton.addEventListener('click', async function (e) {
            disablePage();
            gameHandler.type = 'ring-of-fire';
            if (gameHandler.online) gameHandler.gameObject.initOnline(true)
            goToPage('pg-setup-game');
        });

        rofButton.classList.add('big', 'green');

        this.shadowRoot.appendChild(rofButton);

        let redOrBlackButton = document.createElement('button');
        redOrBlackButton.textContent = 'Red or Black';

        redOrBlackButton.addEventListener('click', async function (e) {
            disablePage();
            gameHandler.type = 'red-or-black';
            if (gameHandler.online) gameHandler.gameObject.initOnline(true)
            goToPage('pg-setup-game');
        });

        redOrBlackButton.classList.add('big', 'green');

        this.shadowRoot.appendChild(redOrBlackButton);


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