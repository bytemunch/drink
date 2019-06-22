/// <reference path='Page.ts'/>

class PlayPage extends Page {
    constructor() {
        super();

        let roomDisplay = document.createElement('p');
        roomDisplay.style.display = 'inline';
        roomDisplay.style.cssFloat = 'left';
        roomDisplay.style.paddingLeft = '3vw';

        roomDisplay.textContent = `Room: ${room.roomId}`;
        this.page.appendChild(roomDisplay);

        let pin = document.createElement('p');
        pin.style.display = 'inline';
        pin.style.cssFloat = 'right';
        pin.style.paddingRight = '5vw';

        pin.textContent = `PIN: ${room.data.pin}`;
        this.page.appendChild(pin);

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