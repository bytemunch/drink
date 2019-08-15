/// <reference path='Page.ts'/>

class PlayPage extends Page {
    constructor() {
        super();

        let ingameMenu = new CePlayMenu;

        this.page.appendChild(ingameMenu);

        let menuButton = new CeShowButton(ingameMenu);

        this.page.appendChild(menuButton);

        let playerInfo = document.createElement('ce-player-list');
        playerInfo.classList.add('smallList');
        this.page.appendChild(playerInfo);

        let card = document.createElement('ce-card-display');

        this.page.appendChild(card);

        let rule = document.createElement('ce-rule-display');

        this.page.appendChild(rule);

        let pickCard = new CeDrawButton;//document.createElement('button');

        this.page.appendChild(pickCard);
    }
}