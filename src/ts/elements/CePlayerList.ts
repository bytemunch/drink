/// <reference path='UpdateableElement.ts'/>

class CePlayerList extends UpdateableElement {
    private players: Array<any> = [];

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();

        this.applyStyle();

        this.addEventListener('click', e => {
            e.preventDefault();
            if (this.classList.contains('smallList')) {
                const growWidths: Array<any> = ['24px', ''];

                if (growWidths.includes(this.style.width)) {
                    animMan.animate(this, 'playerListGrow', 250);
                } else {
                    animMan.animate(this, 'playerListShrink', 250);
                }
            }
        })

        this.update();
    }

    applyStyle() {
    }

    update() {
        super.update();

        // Update data
        let players = GAME.players;

        this.players = [];

        for (let p in players) {
            // sort into this.players in position of turnorder array
            players[p].uid = p;

            if (GAME.playerOrder.length == Object.keys(GAME.players).length) {// JS casting doing bits here ugh
                const pIdx = GAME.playerOrder.indexOf(p);
                pIdx != -1 ? this.players[pIdx] = players[p] : this.players.push(players[p])
            } else {
                this.players.push(players[p]);
            }
        }

        // Re-order array if turns have been taken
        let tmp;
        for (let i = 0; i < GAME.turnCounter; i++) {
            tmp = this.players.shift();
            this.players.push(tmp);
        }

        // Clear DOM
        Array.from(this.childNodes).forEach(el => this.removeChild(el));

        // Update DOM
        this.players.forEach(p => {
            let pElement = document.createElement('ce-player') as CePlayer;
            this.appendChild(pElement);
            pElement.player = p;
        });

        if (this.classList.contains('bigGrid')) {
            let addLocalPlayer = new CeCreatePlayerButton(document.querySelector('ce-create-player-menu'));
            this.appendChild(addLocalPlayer);
        }

    }
}

customElements.define('ce-player-list', CePlayerList);