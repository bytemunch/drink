import Page from "./Page.js";
import goToPage from "../functions/goToPage.js";
import RingOfFire from "../class/RingOfFire.js";
import RedOrBlack from "../class/RedOrBlack.js";

import { gameHandler } from '../index.js';

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

        rofButton.addEventListener('click', e => {
            gameHandler.type = 'ring-of-fire';
            goToPage('pg-setup-game');
        });

        rofButton.classList.add('big', 'green');

        this.appendChild(rofButton);

        let redOrBlackButton = document.createElement('button');
        redOrBlackButton.textContent = 'Red or Black';

        redOrBlackButton.addEventListener('click', e => {
            gameHandler.type = 'red-or-black';
            goToPage('pg-setup-game');
        });

        redOrBlackButton.classList.add('big', 'green');

        this.appendChild(redOrBlackButton);


        let backButton = document.createElement('button');
        backButton.textContent = 'Back';

        backButton.addEventListener('click', e => {
            console.log('Back button pressed!');
            goToPage('pg-home');
        });

        backButton.classList.add('big', 'red');

        this.appendChild(backButton);
    }
}