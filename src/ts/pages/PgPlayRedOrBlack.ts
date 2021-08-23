
import CePopUp from "../elements/CePopUp.js";
import CeNextPlayerCenter from "../elements/CeNextPlayerCenter.js";
import CePotCounter from "../elements/CePotCounter.js";
import CeCard from "../elements/CeCard.js";
import { animMan } from "../index.js";
import goToPage from "../functions/goToPage.js";
import RedOrBlack from "../class/RedOrBlack.js";
import Page from "./Page.js";

import { gameHandler } from '../index.js';
import Card from "../class/Card.js";
import { AnimButton } from "../types.js";

export default class PgPlayRedOrBlack extends Page {

    cardW: number;

    potCount: CePotCounter;

    upNext: CeNextPlayerCenter;

    constructor() {
        super();
        this.header = 'account';

        gameHandler.gameObject.view = this;
        gameHandler.gameObject.state = 'playing';

        console.log(gameHandler);
    }

    async connectedCallback() {
        await super.connectedCallback();
        // add elements to page

        this.cardW = 70;

        let castGame = <RedOrBlack>gameHandler.gameObject;

        // deck image
        let deckImg = document.createElement('img');
        deckImg.style.display = 'block';
        deckImg.style.position = 'absolute';
        deckImg.src = './img/cards/back.svg';
        deckImg.style.width = ((this.cardW / 320) * 100) + '%';
        deckImg.style.height = 'unset';
        deckImg.style.left = ((20 / 320) * 100) + '%';
        this.shadowRoot.appendChild(deckImg);

        // up next
        this.upNext = new CeNextPlayerCenter;
        this.shadowRoot.appendChild(this.upNext);

        // deck image
        let discardImg = document.createElement('img');
        discardImg.classList.add('discard');
        discardImg.style.display = 'block';
        discardImg.style.position = 'absolute';
        discardImg.src = './img/cards/back.svg';
        discardImg.style.width = ((this.cardW / 320) * 100) + '%';
        discardImg.style.height = 'unset';
        discardImg.style.right = ((20 / 320) * 100) + '%';
        discardImg.style.opacity = '0.4';
        this.shadowRoot.appendChild(discardImg);

        let dBB = discardImg.getBoundingClientRect();

        this.potCount = new CePotCounter;

        const size = dBB.width * 0.9;

        this.potCount.style.left = (dBB.left + (dBB.width - size) / 2) + 'px';
        this.potCount.style.width = size + 'px';
        this.potCount.style.height = size + 'px';
        this.potCount.style.marginTop = '6%';
        this.shadowRoot.appendChild(this.potCount);

        let controlGrid = document.createElement('div');
        controlGrid.style.display = 'grid';
        controlGrid.style.gridTemplateColumns = '1fr 1fr 1fr';
        controlGrid.style.gridTemplateRows = '1fr 1fr';
        controlGrid.style.gridGap = '20px';
        controlGrid.style.position = 'absolute';
        controlGrid.style.width = '80%';
        controlGrid.style.maxWidth = '80%';
        controlGrid.style.height = '120px';
        controlGrid.style.left = '10%';
        controlGrid.style.bottom = '10%';
        this.shadowRoot.appendChild(controlGrid);

        const controls = {
            "RR": {
                txt: '2x Red',
                color: 'red'
            },
            "RRBB": {
                txt: '2x Purple',
                color: 'purple'
            },
            "BB": {
                txt: '2x Black',
                color: 'black'
            },
            "R": {
                txt: 'Red',
                color: 'red'
            },
            "RB": {
                txt: 'Purple',
                color: 'purple'
            },
            "B": {
                txt: 'Black',
                color: 'black'
            }
        }

        for (let bet in controls) {
            let c = document.createElement('button');
            c.classList.add(controls[bet].color, 'bet-button')
            c.style.width = '100%';
            c.style.height = '100%';

            let p = document.createElement('p');
            p.textContent = controls[bet].txt;
            p.style.textAlign = 'center';
            c.appendChild(p);

            c.addEventListener('click', async e => {
                // await (<AnimButton>c).baAnimate(e)
                // disable all buttons
                c.classList.add('keep-color');

                for (let b of document.querySelectorAll('.bet-button')) {
                    (<HTMLButtonElement>b).disabled = true;
                }

                let cards = await castGame.takeTurn(bet);
                // Animate card draw

                if (!gameHandler.online) {
                    await this.drawCards(cards);

                    let win = castGame.checkWin(bet, cards);

                    // On loss, popup loser name + amount of drinks
                    // Put previous cards away
                    await this.discard();


                    if (!win) {
                        this.drinkPopUp(castGame);

                        // show all cards to drink for

                        // remove spent cards

                        castGame.clearPot();
                        this.potCount.update();
                    }
                }

                // if no cards left
                if (castGame.deck.cards.length <= 0) {
                    let maybeText = () => {
                        if (castGame.cardPot.length) {
                            return `Everyone drink ${castGame.cardPot.length}!`
                        } else {
                            return '';
                        }
                    }

                    let gameOverText = `No cards left! ${maybeText()}`;

                    let gameOverPopUp = document.createElement('ce-popup') as CePopUp;
                    gameOverPopUp.titleTxt = 'Game Over!';
                    gameOverPopUp.messageTxt = gameOverText;
                    gameOverPopUp.callback = goToPage;
                    gameOverPopUp.callbackArgs = 'ce-home-page';
                    document.body.appendChild(gameOverPopUp);
                    gameOverPopUp.show();
                }

                if (!gameHandler.online) {
                    // reenable buttons
                    this.enableButtons();
                }

            })
            controlGrid.appendChild(c);
        }
    }

    enableButtons() {
        for (let b of document.querySelectorAll('.bet-button')) {
            let button = <HTMLButtonElement>b;
            button.disabled = false;
            button.classList.remove('keep-color');
        }
    }

    drinkPopUp(castGame: RedOrBlack) {
        let drinkPopUp = document.createElement('ce-popup') as CePopUp;
        drinkPopUp.titleTxt = 'Drink!';
        drinkPopUp.messageTxt = `${castGame.players[castGame.previousPlayer].name}, drink ${castGame.cardPot.length}!`;
        drinkPopUp.style.zIndex = '100';
        document.body.appendChild(drinkPopUp);
        drinkPopUp.show();
    }

    async discard() {
        let discardBB = document.querySelector('.discard').getBoundingClientRect();
        let movedAllCards = [];
        for (let card of document.querySelectorAll('ce-card')) {
            movedAllCards.push(animMan.animate(card, 'translateTo', 500, 'easeInOutQuint', { x: discardBB.x, y: discardBB.y }));
        }
        return Promise.all(movedAllCards).then(() => { this.potCount.update(); this.upNext.update(); });
    }

    async drawCards(cards: Card[]) {
        let idx = 0;
        for (let card of cards) {
            let drawnCard = new CeCard;
            drawnCard.style.display = 'block';
            drawnCard.style.position = 'absolute';
            drawnCard.style.width = ((this.cardW / 320) * 100) + '%';
            drawnCard.style.height = 'unset';
            drawnCard.style.left = ((20 / 320) * 100) + '%';
            this.shadowRoot.appendChild(drawnCard);
            (<CeCard>drawnCard).backImg.style.visibility = 'hidden';
            let bb = drawnCard.firstElementChild.getBoundingClientRect();
            let offset = -1 * ((bb.width / 4) * ((cards.length / 2) - idx) - bb.width / 8);
            let tX = (window.innerWidth / 2) - (bb.width / 2) + offset;
            let tY = (window.innerHeight / 2) - (bb.height / 2);
            await animMan.animate(drawnCard, 'translateTo', 250, 'easeOutQuad', { x: tX, y: tY });
            await drawnCard.drawCard(card);
            idx++;
        }
    }
}