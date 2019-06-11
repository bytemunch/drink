/// <reference path='Page.ts'/>

class PlayPage extends Page {
    constructor() {
        super();

        let title = document.createElement('h1');

        title.textContent = `Play`;

        this.page.appendChild(title);

        let pickCard = new CeDrawButton;//document.createElement('button');

        this.page.appendChild(pickCard);

        let card = document.createElement('ce-card-display');

        this.page.appendChild(card);

        let rule = document.createElement('ce-rule-display');

        this.page.appendChild(rule);

        let playerInfo = document.createElement('ce-player-list');
        playerInfo.classList.add('smallList');
        this.page.appendChild(playerInfo);
    }
}