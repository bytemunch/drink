/// <reference path='Page.ts'/>

class AbstractPlayPage extends Page {
    constructor() {
        super();

        let ingameMenu = new CePlayMenu;

        this.page.appendChild(ingameMenu);

        let menuButton = new CeShowButton(ingameMenu);

        this.page.appendChild(menuButton);

        let playerInfo = document.createElement('ce-player-list');
        playerInfo.classList.add('smallList');
        this.page.appendChild(playerInfo);
    }
}