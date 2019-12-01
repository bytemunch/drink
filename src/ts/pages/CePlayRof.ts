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

        // Card display
        let cardDisplay = new CeOfflineCard;
        this.appendChild(cardDisplay);

        // Rule Display
        let ruleDisplay = new CeOfflineRule;
        this.appendChild(ruleDisplay);

        // Draw button

        let drawButton = document.createElement('button');
        drawButton.textContent = 'Draw Card';
        drawButton.classList.add('big','bottom');

        drawButton.addEventListener('click', e=>{
            if (drawButton.textContent == 'End Game') {
                goToPage('ce-home-page');
            } else {
                let card = GAME.takeTurn();
                cardDisplay.drawCard(card);
                if (GAME.state !== 'finished') {
                    ruleDisplay.update();
                } else {
                    // game over
                    drawButton.textContent = 'End Game';
                    drawButton.classList.add('red');
                }
            }
        })

        this.appendChild(drawButton);
    }
}

customElements.define('ce-play-rof',CePlayRof);