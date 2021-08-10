import UpdateableElement from "./UpdateableElement.js";
import CeAvatar from "./CeAvatar.js";

import {gameHandler} from '../index.js';

export default class CeNextPlayerCenter extends UpdateableElement {
    playerName:HTMLHeadingElement;
    playerAvi:CeAvatar;

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.style.display = 'block';
        this.style.position = 'absolute';
        this.style.left = '50%';
        this.style.overflow = 'visible';
        this.style.transform = 'translateX(-50%)';
        

        let upnext = document.createElement('h3');
        upnext.textContent = 'Up Next:';
        upnext.style.textAlign = 'center';
        this.shadowRoot.appendChild(upnext);

        this.playerAvi = new CeAvatar;
        this.playerAvi.style.position = 'absolute';
        this.playerAvi.style.left = '50%';
        this.playerAvi.style.transform = 'translateX(-50%)';
        this.shadowRoot.appendChild(this.playerAvi);

        this.playerName = document.createElement('h4');
        this.playerName.textContent = 'player name';
        this.playerName.style.textAlign = 'center';
        this.playerName.style.position = 'absolute';
        this.playerName.style.top = '250%';
        this.playerName.style.width = '100%';

        this.shadowRoot.appendChild(this.playerName);

        this.update();
    }

    update() {
        super.update();
        this.playerName.textContent = gameHandler.gameObject.players[gameHandler.gameObject.currentPlayer].name;
        this.playerAvi.uid = gameHandler.gameObject.currentPlayer;
    }
}