/// <reference path='CePage.ts'/>

class CePlayRof extends CePage {

    constructor() {
        super();
        this.header = 'account';
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();
        // add elements to page

        let nextPlayer = new CeNextPlayer;
        this.appendChild(nextPlayer);

        // Card display
        let cardDisplay = new CeCard;
        cardDisplay.classList.add('large');
        this.appendChild(cardDisplay);

        // Rule Display
        let ruleDisplay = new CeRule;
        this.appendChild(ruleDisplay);

        // Draw button

        let drawButton = document.createElement('button');
        drawButton.textContent = 'Draw Card';
        drawButton.classList.add('big', 'bottom');
        drawButton.id = 'draw';

        drawButton.addEventListener('click', async e => {

            if (GAME.online) {
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
                goToPage('ce-home-page');
            } else {
                await (<RingOfFire>GAME).takeTurn()
                // .then(card => {
                //     if (card.number !== '' && card.suit !== '') {
                //         if (!GAME.online) cardDisplay.drawCard(card);
                //     } else {
                //         throw new Error(card);
                //     }
                // })
                // .catch(e=>{console.error(e)})

                if (GAME.state !== 'finished') {
                    // updateDOM();
                } else {
                    // game over
                    drawButton.textContent = 'End Game';
                    drawButton.classList.add('red');
                }
            }
        })

        this.appendChild(drawButton);


        // Update DOM after joined
        setTimeout(() => {
            updateDOM();
        }, 500)
    }
}

customElements.define('ce-play-rof', CePlayRof);