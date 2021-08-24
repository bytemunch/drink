import CeNextPlayer from "../elements/CeNextPlayer.js";
import CeCard from "../elements/CeCard.js";
import CeRule from "../elements/CeRule.js";
import goToPage from "../functions/goToPage.js";
import RingOfFire from "../class/RingOfFire.js";
import Page from "./Page.js";

import {gameHandler, observer} from '../index.js';

export default class PgPlayRingOfFire extends Page {

    constructor() {
        super();
        this.header = 'account';
    }

    async connectedCallback() {
        await super.connectedCallback();
        // add elements to page

        let nextPlayer = new CeNextPlayer;
        this.shadowRoot.appendChild(nextPlayer);

        // Card display
        let cardDisplay = new CeCard;
        this.shadowRoot.appendChild(cardDisplay);
        cardDisplay.style.width = '40%';


        // Rule Display
        let ruleDisplay = new CeRule;
        this.shadowRoot.appendChild(ruleDisplay);

        // Draw button

        let drawButton = document.createElement('button');
        drawButton.textContent = 'Draw Card';
        drawButton.classList.add('big');
        drawButton.id = 'draw-button';

        observer.watch('draw-toggle', msg => {
            drawButton.disabled = msg == 'disable';
        })

        drawButton.addEventListener('click', async function (e) {
            if (drawButton.textContent == 'End Game') {
                goToPage('pg-home');
            } else {
                await (<RingOfFire>gameHandler.gameObject).takeTurn()
                
                if (gameHandler.gameObject.state !== 'finished') {

                } else {
                    // game over
                    drawButton.textContent = 'End Game';
                    drawButton.classList.add('red');
                }
            }
        })

        this.shadowRoot.appendChild(drawButton);
    }
}