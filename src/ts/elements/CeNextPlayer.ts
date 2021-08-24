import CeAvatar from "./CeAvatar.js";

import {gameHandler} from '../index.js';
import CustomElement from "./CustomElement.js";

export default class CeNextPlayer extends CustomElement {
    playerName:HTMLHeadingElement;
    playerAvi:CeAvatar;

    constructor() {
        super();
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.playerAvi = this.shadowRoot.querySelector('ce-avatar');

        this.playerName = this.shadowRoot.querySelector('#player-name')

        this.applyStyle();
        this.update();
    }

    update() {
        super.update();
        this.playerName.textContent = gameHandler.gameObject.players[gameHandler.gameObject.currentPlayer].name;
        this.playerAvi.uid = gameHandler.gameObject.currentPlayer;
    }
}