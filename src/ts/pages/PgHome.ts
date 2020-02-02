import Page from "./Page.js";
import goToPage from "../functions/goToPage.js";
import { LOCAL_MODE } from "../index.js";

export default class PgHome extends Page {
    constructor() {
        super();
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();
        // add elements to page
        let offlineGameButton = document.createElement('button');
        offlineGameButton.textContent = 'Play';

        offlineGameButton.addEventListener('click', e => {
            console.log('Offline game button pressed!');
            goToPage('pg-game-select');
        });

        offlineGameButton.classList.add('big');

        this.appendChild(offlineGameButton);


        if (!LOCAL_MODE) {
            offlineGameButton.textContent = 'Play Local';

            let onlineGameButton = document.createElement('button');
            onlineGameButton.textContent = 'Play Online';

            onlineGameButton.addEventListener('click', e => {
                console.log('Online game button pressed!');
                goToPage('pg-play-online');
            });

            onlineGameButton.classList.add('big', 'green');

            this.appendChild(onlineGameButton);
        }
    }
}