import UpdateableElement from "./UpdateableElement.js";
import CeAvatar from "./CeAvatar.js";

import {gameHandler} from '../index.js';

export default class CeNextPlayer extends UpdateableElement {
    playerName:HTMLHeadingElement;
    playerAvi:CeAvatar;

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.style.display = 'block';
        this.style.position = 'absolute';
        

        let upnext = document.createElement('h3');
        upnext.textContent = 'Up Next:';
        this.appendChild(upnext);

        this.playerAvi = new CeAvatar;
        this.playerAvi.style.float = 'left';
        this.appendChild(this.playerAvi);

        this.playerName = document.createElement('h4');
        this.playerName.textContent = 'player name';
        this.appendChild(this.playerName);

        this.update();
    }

    update() {
        super.update();
        this.playerName.textContent = gameHandler.gameObject.players[gameHandler.gameObject.currentPlayer].name;
        this.playerAvi.uid = gameHandler.gameObject.currentPlayer;
    }
}