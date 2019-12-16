/// <reference path='CePage.ts'/>

class CeSetupGame extends CePage {
    constructor() {
        super();
        this.header = 'account';
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();
        // add elements to page
        // Player config bits!!
        let createPlayer = new CeCreatePlayerMenu;
        this.appendChild(createPlayer);

        let playerInfo = document.createElement('ce-player-list');
        playerInfo.classList.add('bigGrid');
        this.appendChild(playerInfo);

        let startButton = document.createElement('button');
        startButton.textContent = 'Start';

        startButton.addEventListener('click', e => {
            goToPage(`ce-play-${GAME.type}`);
        });

        startButton.classList.add('big','green');

        this.appendChild(startButton);

        let backButton = document.createElement('button');
        backButton.textContent = 'Back';

        backButton.addEventListener('click', e => {
            console.log('Back button pressed!');
            goToPage('ce-home-page');
        });

        backButton.classList.add('big','red', 'bottom');

        this.appendChild(backButton);
    }
}

customElements.define('ce-setup-game',CeSetupGame);