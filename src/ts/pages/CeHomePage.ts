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
        offlineGameButton.textContent = 'Play';

        offlineGameButton.addEventListener('click', e => {
            console.log('Offline game button pressed!');
            goToPage('ce-game-select-page');
        });

        offlineGameButton.classList.add('big');

        this.appendChild(offlineGameButton);


        if (!LOCAL_MODE) {
            offlineGameButton.textContent = 'Play Local';

            let onlineGameButton = document.createElement('button');
            onlineGameButton.textContent = 'Play Online';

            onlineGameButton.addEventListener('click', e => {
                console.log('Online game button pressed!');
                goToPage('ce-play-online');
            });

            onlineGameButton.classList.add('big', 'green');

            this.appendChild(onlineGameButton);
        }
    }
}

customElements.define('ce-home-page', CeHomePage);