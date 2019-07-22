/// <reference path='Page.ts'/>

class LobbyPage extends Page {
    constructor() {
        super();

        // Add menu modal
        let menu = new CeLobbyMenu;

        this.page.appendChild(menu);

        let menuButton = new CeShowHideButton(menu);

        this.page.appendChild(menuButton);


        let title = document.createElement('h1');

        title.textContent = `Lobby.`;

        this.page.appendChild(title);

        let roomDisplay = document.createElement('h2');
        roomDisplay.style.display = 'inline';
        roomDisplay.style.cssFloat = 'left';

        roomDisplay.textContent = `Room: ${room.roomId}`;
        this.page.appendChild(roomDisplay);

        let pin = document.createElement('h2');
        pin.style.display = 'inline';
        pin.style.cssFloat = 'right';

        pin.textContent = `PIN: ${room.data.pin}`;
        this.page.appendChild(pin);

        let playerInfo = document.createElement('ce-player-list');
        playerInfo.classList.add('bigGrid');
        this.page.appendChild(playerInfo);


        let startButton = new CeStartReadyButton;//document.createElement('ce-start-button');

        this.page.appendChild(startButton);

    }
}