/// <reference path='Page.ts'/>

class LobbyPage extends Page {
    constructor() {
        super();

        let title = document.createElement('h1');

        title.textContent = `Room ${roomdata.roomId}.`;

        this.page.appendChild(title);

        let pin = document.createElement('h2');

        pin.textContent = `PIN: ${roomdata.data.pin}`;
        this.page.appendChild(pin);

        let playerInfo = document.createElement('ce-player-list');
        this.page.appendChild(playerInfo);

    }
}