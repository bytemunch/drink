
class CeNextPlayer extends UpdateableElement {
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
        //@ts-ignore float is on CSSStyleDeclaration
        this.playerAvi.style.float = 'left';
        this.appendChild(this.playerAvi);

        this.playerName = document.createElement('h4');
        this.playerName.textContent = 'player name';
        this.appendChild(this.playerName);

        this.update();
    }

    update() {
        super.update();
        let nextPlayer = GAME.players[GAME.currentPlayer];
        this.playerName.textContent = nextPlayer.name;
        this.playerAvi.uid = nextPlayer.uid;

    }
}

customElements.define('ce-next-player',CeNextPlayer);