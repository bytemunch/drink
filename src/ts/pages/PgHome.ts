import Page from "./Page.js";
import goToPage from "../functions/goToPage.js";
import { LOCAL_MODE } from "../index.js";
import disablePage from "../functions/disablePage.js";

export default class PgHome extends Page {
    constructor() {
        super();
    }

    async connectedCallback() {
        await super.connectedCallback();
        let offlineGameButton = this.shadowRoot.querySelector('#play-local');;

        offlineGameButton.addEventListener('click', async function (e) {
            disablePage();
            goToPage('pg-game-select');
        });

        if (!LOCAL_MODE) {
            offlineGameButton.textContent = 'Play Local';

            let onlineGameButton = this.shadowRoot.querySelector('#play-online') as HTMLButtonElement;
            onlineGameButton.style.display = 'block';

            onlineGameButton.addEventListener('click', async function (e) {
                disablePage();
                console.log('Online game button pressed!');
                goToPage('pg-play-online')
            });
        }
    }
}