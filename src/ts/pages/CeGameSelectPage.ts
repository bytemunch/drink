/// <reference path='CePage.ts'/>

class CeGameSelectPage extends CePage {
    constructor() {
        super();
        this.header = 'account';
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();
        // add elements to page

        let rofButton = document.createElement('button');
        rofButton.textContent = 'Ring of Fire';

        rofButton.addEventListener('click', e => {
            GAME = new RingOfFire;
            goToPage('ce-setup-game');
        });

        rofButton.classList.add('big','green');

        this.appendChild(rofButton);

        let redOrBlackButton = document.createElement('button');
        redOrBlackButton.textContent = 'Red or Black';

        redOrBlackButton.addEventListener('click', e => {
            GAME = new RedOrBlack;
            goToPage('ce-setup-game');
        });

        redOrBlackButton.classList.add('big','green');

        this.appendChild(redOrBlackButton);


        let backButton = document.createElement('button');
        backButton.textContent = 'Back';

        backButton.addEventListener('click', e => {
            console.log('Back button pressed!');
            goToPage('ce-home-page');
        });

        backButton.classList.add('big','red');

        this.appendChild(backButton);
    }
}

customElements.define('ce-game-select-page',CeGameSelectPage);