import updateDOM from "../functions/updateDOM.js";
import CeNextPlayer from "../elements/CeNextPlayer.js";
import CeCard from "../elements/CeCard.js";
import CeRule from "../elements/CeRule.js";
import goToPage from "../functions/goToPage.js";
import RingOfFire from "../class/RingOfFire.js";
import Page from "./Page.js";

import {gameHandler} from '../index.js';
import { AnimButton } from "../types.js";

export default class PgPlayRingOfFire extends Page {

    constructor() {
        super();
        this.header = 'account';
    }

    connectedCallback() {
        super.connectedCallback();
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
        drawButton.classList.add('big', 'bottom');
        drawButton.id = 'draw';

        drawButton.addEventListener('click', async function (e) {
            // await (<AnimButton>this).baAnimate(e)
            if (gameHandler.gameObject.online) {
                //debounce

                // TODO Very bad, reeanables button no matter what so can get desync if internet too quick!
                drawButton.disabled = true;
                drawButton.classList.add('grey');
                setTimeout(() => {
                    drawButton.disabled = false;
                    drawButton.classList.remove('grey');
                }, 1500)
            }

            if (drawButton.textContent == 'End Game') {
                goToPage('pg-home');
            } else {
                await (<RingOfFire>gameHandler.gameObject).takeTurn()
                if (!gameHandler.gameObject.online) updateDOM();

                (<CeRule>document.querySelector('ce-rule')).applyStyle();

                if (gameHandler.gameObject.state !== 'finished') {

                } else {
                    // game over
                    drawButton.textContent = 'End Game';
                    drawButton.classList.add('red');
                }
            }
        })

        this.shadowRoot.appendChild(drawButton);


        // Update DOM after joined
        setTimeout(() => {
            updateDOM();
        }, 500)
    }
}