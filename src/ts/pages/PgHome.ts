import Page from "./Page.js";
import goToPage from "../functions/goToPage.js";
import { LOCAL_MODE } from "../index.js";
import addExpandingCircles, { addAnimate } from "../functions/buttonAnimator.js";
import {AnimButton} from '../types';
import disablePage from "../functions/disablePage.js";

export default class PgHome extends Page {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        // add elements to page
        let offlineGameButton = document.createElement('button');
        offlineGameButton.textContent = 'Play';

        offlineGameButton.addEventListener('click', async function (e) {
            disablePage();
            // await (<AnimButton>this).baAnimate(e)
            goToPage('pg-game-select');
        });

        offlineGameButton.classList.add('big');

        this.shadowRoot.appendChild(offlineGameButton);

        if (!LOCAL_MODE) {
            offlineGameButton.textContent = 'Play Local';

            let onlineGameButton = document.createElement('button');
            onlineGameButton.textContent = 'Play Online';

            onlineGameButton.addEventListener('click', async function (e) {
                disablePage();
                // await (<AnimButton>this).baAnimate(e)
                console.log('Online game button pressed!');
                goToPage('pg-play-online')
            });

            onlineGameButton.classList.add('big', 'green');

            this.shadowRoot.appendChild(onlineGameButton);
        }
    }
}