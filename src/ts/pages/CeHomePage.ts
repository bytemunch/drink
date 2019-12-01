/// <reference path='CePage.ts'/>

class CeHomePage extends CePage {
    constructor() {
        super();
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();
        // add elements to page
        let offlineGameButton = document.createElement('button');
        offlineGameButton.textContent = 'Play Local';

        offlineGameButton.addEventListener('click', e => {
            console.log('Offline game button pressed!');
            goToPage('ce-play-offline');
        });

        offlineGameButton.classList.add('big');

        this.appendChild(offlineGameButton);

        let onlineGameButton = document.createElement('button');
        onlineGameButton.textContent = 'Play Online';

        onlineGameButton.addEventListener('click', e => {
            console.log('Offline game button pressed!');
        });

        onlineGameButton.classList.add('big', 'green');

        this.appendChild(onlineGameButton);
    }
}

customElements.define('ce-home-page',CeHomePage);