/// <reference path='UpdateableElement.ts'/>

class CeCardDisplay extends UpdateableElement {
    img;

    constructor() {
        super();
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();

        this.classList.add('big');

        this.img = document.createElement('img');
        this.appendChild(this.img);

        this.applyStyle();

    }

    update() {
        super.update();
        let suit = room.data.currentCard.suit;
        let number = room.data.currentCard.number;

        if (suit == 'joker') {
            let x = number % 3;
            if (x==0) number = 'red';
            if (x==1) number = 'black';
            if (x==2) number = 'white';
        }
        fetch(`/img/cards/${suit}/${number}.svg`)
        .then(res=>res.blob())
        .then(data=>{
            let src;
            if (data.type == 'text/html') {
                src = `/img/cards/back.svg`
            } else {
                src = URL.createObjectURL(data);
            }

            this.img.setAttribute('src',src);
        })
    }

}

customElements.define('ce-card-display', CeCardDisplay);