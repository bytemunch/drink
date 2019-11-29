/// <reference path='CeMenu.ts'/>

class CePlayMenu extends CeMenu {
    constructor() {
        super();
    }

    applyStyle() {
        super.applyStyle();
    }

    connectedCallback() {
        super.connectedCallback();

        // Show room info
        let roomDisplay = document.createElement('p');
        roomDisplay.classList.add('roominfo');
        roomDisplay.textContent = `Room: ${room.roomId}`;
        this.menu.appendChild(roomDisplay);

        let pin = document.createElement('p');
        pin.style.cssFloat = 'right';
        pin.classList.add('roominfo');
        pin.textContent = `PIN: ${room.data.pin}`;
        this.menu.appendChild(pin);

        this.addLeaveRoom();

        this.applyStyle();
    }
}

customElements.define('ce-play-menu', CePlayMenu);