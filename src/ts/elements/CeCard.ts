import UpdateableElement from "./UpdateableElement.js";
import Card from "../class/Card.js";
import { animMan } from "../index.js";
import RingOfFire from "../class/RingOfFire.js";

import { gameHandler } from '../index.js';

export default class CeCard extends UpdateableElement {
    img: HTMLImageElement;
    backImg: HTMLImageElement;
    currentCard: Card;

    constructor() {
        super();
    }

    applyStyle() {
        this.classList.add('card-display');

        if (gameHandler.gameObject.type === 'ring-of-fire') this.style.left = `calc((${window.innerWidth}px - ${this.backImg.getBoundingClientRect().width}px) / 2)`;
        super.applyStyle();
    }

    connectedCallback() {
        super.connectedCallback();

        this.backImg = document.createElement('img');
        this.backImg.setAttribute('src', `/img/cards/back.svg`);
        this.backImg.classList.add('back-img');
        this.shadowRoot.appendChild(this.backImg);

        this.img = document.createElement('img');
        this.img.setAttribute('src', `/img/cards/back.svg`);
        this.backImg.classList.add('card-display-front');
        this.shadowRoot.appendChild(this.img);

        this.applyStyle();
    }

    async drawCard(card: Card) {
        this.currentCard = card;
        let suit = card.suit;
        let number = card.number;

        // Discards if we haven't already due to it being another player's turn
        if (this.img.src !== this.backImg.src) {
            await this.discard();
        }

        if (suit == 'joker') {
            let x = Number(number) % 2;
            if (x == 0) number = 'black';
            if (x == 1) number = 'red';
        }

        number = number.toLowerCase();

        return fetch(`/img/cards/${suit}/${number}.svg`)
            .then(res => res.blob())
            .then(async image => {

                if (image.type == 'text/html') {
                    console.log(image, suit, number);
                    throw 'card not found!';
                }

                const newCardSrc = URL.createObjectURL(image);
                const backCardSrc = this.backImg.src;


                this.img.setAttribute('src', backCardSrc);

                // begin flip animation

                await animMan.animate(this.img, 'turnCard', 1000, 'easeInOutQuint', { newSrc: newCardSrc });
                URL.revokeObjectURL(newCardSrc);
                return true;
            })
    }

    async discard() {
        // Move currently displayed card off screen / move & fade
        // Display card back
        await animMan.animate(this.img, 'flyRight', 500, 'linear', { startBB: this.getBoundingClientRect() });
        // reset card
        this.img.style.opacity = '1';
        this.img.style.transform = 'unset';
        this.img.src = this.backImg.src;
        return true;
    }

    update() {
        super.update();

        if ((<RingOfFire>gameHandler.gameObject).currentCard !== this.currentCard && (<RingOfFire>gameHandler.gameObject).currentCard.number !== '') {
            this.drawCard((<RingOfFire>gameHandler.gameObject).currentCard);
        }

        this.applyStyle();
    }

}