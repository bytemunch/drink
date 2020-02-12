import goToPage from "../functions/goToPage.js";
import RingOfFire from "../class/RingOfFire.js";
import Page from "./Page.js";

import {gameHandler} from '../index.js';
import { AnimButton } from "../types.js";

export default class PgPlayOffline extends Page {
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

        let playButton = document.createElement('button');
        playButton.textContent = 'Play';

        playButton.addEventListener('click', async function (e) {
            await (<AnimButton>this).baAnimate(e)
            console.log('Play button pressed!');
            gameHandler.type = 'ring-of-fire';
            goToPage('pg-play-ring-of-fire');
        });

        playButton.classList.add('big','green');

        this.appendChild(playButton);


        let backButton = document.createElement('button');
        backButton.textContent = 'Back';

        backButton.addEventListener('click',async function (e) {
            await (<AnimButton>this).baAnimate(e)
            console.log('Back button pressed!');
            goToPage('pg-home');
        });

        backButton.classList.add('big','red');

        this.appendChild(backButton);
    }
}