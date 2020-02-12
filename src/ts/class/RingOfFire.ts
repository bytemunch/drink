import CePlayerList from "../elements/CePlayerList.js";
import Game from "./Game.js";
import Deck from "./Deck.js";
import Card from "./Card.js";
import updateDOM from "../functions/updateDOM.js";
import errorPopUp from "../functions/errorPopUp.js";
import CeRule from "../elements/CeRule.js";
import CeCard from "../elements/CeCard.js";
import goToPage from "../functions/goToPage.js";
import CeNextPlayer from "../elements/CeNextPlayer.js";

import {userdata, gameHandler} from '../index.js';
import RuleSet from "./RuleSet.js";

export default class RingOfFire extends Game {
    type: string;
    deck: Deck;
    ruleset: RuleSet;
    currentCard: Card;

    constructor(online?, id?, pin?) {
        super(online, id, pin);
        this.type = 'ring-of-fire';
        this.ruleset = new RuleSet('default');
        this.deck = new Deck;
        this.currentCard = new Card('', '');
    }

    async takeTurn() {

        let card;

        if (this.online) {
            card = await this.deck.drawOnline()
        } else {
            card = this.deck.drawCard();
            this.currentCard = card;
            updateDOM();
        }

        console.log(card);

        if (card.number === '' || card.suit === '' || card.err || !card) {
            errorPopUp(card.err);
            const drawButton = (<HTMLButtonElement>document.querySelector('#draw'));

            // Disable draw button
            drawButton.disabled = true;
            drawButton.classList.add('grey');

            return false;
        }

        super.takeTurn();

        if (this.ruleset.winState.if == 'LAST_KING') {
            if (card.number == 'K') {
                let kingFoundInDeck = false;
                for (let c of this.deck.cards) {
                    if (c.number == 'K') kingFoundInDeck = true;
                }

                if (!kingFoundInDeck) {
                    // end game
                    this.state = 'finished';

                    (<CeRule>document.querySelector('.rule-display')).update(this.ruleset.winState.then)
                }
            }
        }
        return card;
    }

    onListenerUpdate(newData, oldData) {
        // somehow update the dom once without causing spazzy shit
        // debouncing NOOOOOOOOOOOOOOOOOOOOO

        let newCard = newData.currentCard,
            oldCard = this.currentCard;

        if (newCard.suit != oldCard.suit || newCard.number != oldCard.number) {
            this.currentCard = newData.currentCard;
            (<CeCard>document.querySelector('ce-card')).update();
            (<CeRule>document.querySelector('ce-rule')).update();
        }

        if (oldData.state !== newData.state) {
            console.log('statechange!')
            if (oldData.state === 'setup' && newData.state === 'playing') {
                goToPage('pg-play-ring-of-fire');
            }
        }

        for (let prop in oldData) {
            if (prop == 'deck') { // fix for killing deck object TODO deck.update(newCards) or deck.remove(card)
                if (newData['deck'].cards !== oldData['deck'].cards) this['deck'].cards = newData['deck'].cards;
            } else {
                if (newData[prop] !== oldData[prop]) this[prop] = newData[prop]
            }
        }

        super.onListenerUpdate(newData, oldData);

        if (gameHandler.gameObject.state === 'playing') {
            (<CeNextPlayer>document.querySelector('ce-next-player')).update();

            const drawButton = (<HTMLButtonElement>document.querySelector('#draw'));

            if (drawButton && gameHandler.gameObject.currentPlayer !== userdata.uid) {
                // Disable draw button
                drawButton.disabled = true;
                drawButton.classList.add('grey');
            } else {
                // enable draw button
                drawButton.disabled = false;
                drawButton.classList.remove('grey');
            }
        }

        if (gameHandler.gameObject.state === 'setup') {
            (<CePlayerList>document.querySelector('ce-player-list')).update();
        }
    }
}