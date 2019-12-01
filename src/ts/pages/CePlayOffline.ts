/// <reference path='CePage.ts'/>

class CePlayOffline extends CePage {
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

        let playButton = document.createElement('button');
        playButton.textContent = 'Play';

        playButton.addEventListener('click', e => {
            console.log('Play button pressed!');
            GAME = new RingOfFire;
            goToPage('ce-play-rof');
        });

        playButton.classList.add('big','green');

        this.appendChild(playButton);


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

customElements.define('ce-play-offline',CePlayOffline);