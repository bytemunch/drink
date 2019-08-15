/// <reference path='Page.ts'/>

class LobbyPage extends Page {
    constructor() {
        super();

        // Add menu modal
        let menu = new CeLobbyMenu;

        this.page.appendChild(menu);

        let menuButton = new CeShowButton(menu);

        this.page.appendChild(menuButton);


        let title = document.createElement('h1');

        title.textContent = `Lobby.`;
        title.style.textAlign = `center`;

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

        let createPlayer = new CeCreatePlayerMenu;
        this.page.appendChild(createPlayer);

        let playerInfo = document.createElement('ce-player-list');
        playerInfo.classList.add('bigGrid');
        this.page.appendChild(playerInfo);

        let inviteModal = new CeInviteMenu;

        this.page.appendChild(inviteModal);

        let inviteButton = new CeInviteButton(inviteModal);

        this.page.appendChild(inviteButton);

        let startButton = new CeStartReadyButton;//document.createElement('ce-start-button');

        this.page.appendChild(startButton);

    }
}