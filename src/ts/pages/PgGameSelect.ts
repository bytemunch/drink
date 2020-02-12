import Page from "./Page.js";
import goToPage from "../functions/goToPage.js";
import RingOfFire from "../class/RingOfFire.js";
import RedOrBlack from "../class/RedOrBlack.js";

import { gameHandler } from '../index.js';
import { AnimButton } from "../types.js";
import disablePage from "../functions/disablePage.js";

export default class PgGameSelect extends Page {
    constructor() {
        super();
        this.header = 'account';
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();
        // add elements to page

        let rofButton = document.createElement('button');
        rofButton.textContent = 'Ring of Fire';

        rofButton.addEventListener('click', async function (e) {
            disablePage();
            await (<AnimButton>this).baAnimate(e)
            gameHandler.type = 'ring-of-fire';
            if (gameHandler.online) gameHandler.gameObject.initOnline(true)
            goToPage('pg-setup-game');
        });

        rofButton.classList.add('big', 'green');

        this.appendChild(rofButton);

        let redOrBlackButton = document.createElement('button');
        redOrBlackButton.textContent = 'Red or Black';

        redOrBlackButton.addEventListener('click', async function (e) {
            disablePage();
            await (<AnimButton>this).baAnimate(e)
            gameHandler.type = 'red-or-black';
            if (gameHandler.online) gameHandler.gameObject.initOnline(true)
            goToPage('pg-setup-game');
        });

        redOrBlackButton.classList.add('big', 'green');

        this.appendChild(redOrBlackButton);


        let backButton = document.createElement('button');
        backButton.textContent = 'Back';

        backButton.addEventListener('click', async function (e) {
            disablePage();
            await (<AnimButton>this).baAnimate(e)
            console.log('Back button pressed!');
            goToPage('pg-home');
        });

        backButton.classList.add('big', 'red');

        this.appendChild(backButton);
    }
}