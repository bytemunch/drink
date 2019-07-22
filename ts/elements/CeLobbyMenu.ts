/// <reference path='CeMenu.ts'/>

class CeLobbyMenu extends CeMenu {
    constructor() {
        super();
    }

    applyStyle() {
        super.applyStyle();
    }

    connectedCallback() {
        super.connectedCallback();

        this.addLeaveRoom();
        this.applyStyle();
    }
}

customElements.define('ce-lobby-menu', CeLobbyMenu);