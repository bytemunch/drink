/// <reference path='UpdateableElement.ts'/>

class CeCardDisplay extends UpdateableElement {
    number;
    suit;

    constructor() {
        super();
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();

        this.classList.add('big');

        this.number = document.createElement('p');
        this.suit = document.createElement('p');

        this.number.textContent = '#';
        this.suit.textContent = 'Suit';

        this.appendChild(this.number);
        this.appendChild(this.suit);

        this.applyStyle();

    }

    update() {
        super.update();

        this.number.textContent = room.data.currentCard.number;
        this.suit.textContent = room.data.currentCard.suit;
    }

}

customElements.define('ce-card-display', CeCardDisplay);