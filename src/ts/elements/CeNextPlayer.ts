
class CeNextPlayer extends UpdateableElement {
    player:CePlayer;

    constructor() {
        super();
    }

    connectedCallback() {
        this.getNextPlayer();
    }

    getNextPlayer() {
        if (this.querySelector('ce-player')) this.removeChild(this.player);
        this.player = GAME.players[GAME.getNextPlayer()];
        this.appendChild(this.player);
    }

    update() {
        this.getNextPlayer();
    }
}

customElements.define('ce-next-player',CeNextPlayer);