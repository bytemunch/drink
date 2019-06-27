class CeCardDisplay extends UpdateableElement {
    img;
    backImg;
    suit;
    number;
    animations;

    constructor() {
        super();
        this.animations = new PromiseAnimations;
    }

    applyStyle() {
        this.style.position = 'relative';
        this.style.display = 'flex';
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('big');

        this.backImg = document.createElement('img');
        this.backImg.setAttribute('src', `/img/cards/back.svg`);
        this.backImg.style.position = 'absolute';
        this.backImg.style.left = '0';
        this.backImg.style.top = '0';
        this.backImg.style.display = 'inline-flex';
        this.appendChild(this.backImg);

        this.img = document.createElement('img');
        this.img.setAttribute('src', `/img/cards/back.svg`);
        // this.img.style.position = 'absolute';
        this.img.style.left = '0';
        this.img.style.top = '0';
        this.appendChild(this.img);

        this.applyStyle();
    }

    async drawCard(suit, number) {
        // IF this.img.src !== this.backImg.src
        // discard

        // Discards if we haven't already due to it being another player's turn
        if (this.img.src !== this.backImg.src) {
            await this.discard();
        }

        if (suit == 'joker') {
            let x = number % 3;
            if (x == 0) number = 'red';
            if (x == 1) number = 'black';
            if (x == 2) number = 'white';
        }
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
                await this.animations.animate(this.img,'flip90',500)
                this.img.setAttribute('src',newCardSrc);
                await this.animations.animate(this.img,'flipBack90',500)
                // console.log('done',suit,number);
                URL.revokeObjectURL(newCardSrc);
                return true;
            })
    }

    async discard() {
        // Move currently displayed card off screen / move & fade
        // Display card back
        this.backImg.display = 'unset';
        await this.animations.animate(this.img,'flyRight',500,{startBB: this.getBoundingClientRect()});
        // reset card
        this.img.style.opacity = '1';
        this.img.style.transform = 'unset';
        this.img.src = this.backImg.src;
        return true;
    }

    update() {
        super.update();
        // IF this.suit !== roomdata.suit
        //  switch card to new one
        if (this.suit !== room.data.currentCard.suit || this.number !== room.data.currentCard.number) {
            this.suit = room.data.currentCard.suit;
            this.number = room.data.currentCard.number;
            this.drawCard(this.suit, this.number);
        }
    }

}

customElements.define('ce-card-display', CeCardDisplay);