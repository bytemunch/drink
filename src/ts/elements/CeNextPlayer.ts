import UpdateableElement from "./UpdateableElement.js";
import CeAvatar from "./CeAvatar.js";

import {gameHandler} from '../index.js';

export default class CeNextPlayer extends UpdateableElement {
    playerName:HTMLHeadingElement;
    playerAvi:CeAvatar;

    constructor() {
        super();

        // TODO put this in UpdateableElement?
        gameHandler.updater.push(this.update.bind(this));
    }

    connectedCallback() {
        super.connectedCallback();
        

        let upnext = document.createElement('h3');
        upnext.textContent = 'Up Next:';
        this.shadowRoot.appendChild(upnext);

        this.playerAvi = new CeAvatar;
        this.shadowRoot.appendChild(this.playerAvi);

        this.playerName = document.createElement('h4');
        this.playerName.textContent = 'player name';
        this.shadowRoot.appendChild(this.playerName);

        this.update();
    }

    update() {
        super.update();
        this.playerName.textContent = gameHandler.gameObject.players[gameHandler.gameObject.currentPlayer].name;
        this.playerAvi.uid = gameHandler.gameObject.currentPlayer;
    }
}