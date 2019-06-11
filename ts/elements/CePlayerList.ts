/// <reference path='UpdateableElement.ts'/>

class CePlayerList extends UpdateableElement {
    private players: Array<any> = [];

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();

        this.applyStyles();
    }

    applyStyles() {
        // this.style.display = 'grid'
        // this.style.width = '100vw';
        // this.style.height = '40vh'
        // this.style.gridTemplateColumns = 'repeat(2,45vw)';
        // this.style.gridAutoRows = '20%';
        // this.style.gridAutoFlow = 'row'
        // this.style.gridGap = '2.5vw';
        // this.style.paddingLeft = '3.5vw';

        // this.style.position = 'relative';
    }

    update() {
        super.update();

        // Update data
        let players = room.data.players;

        this.players = [];

        for (let p in players) {
            // sort into this.players in position of turnorder array
            let turnorder = room.data.turnorder;
            if (turnorder) {
                this.players[turnorder.indexOf(players[p].uid)] = players[p];
            } else {
                this.players.push(players[p]);
            }
        }

        // Clear DOM
        Array.from(this.childNodes).forEach(el => this.removeChild(el));

        // Update DOM
        this.players.forEach(p => {
            let pElement = document.createElement('ce-player') as CePlayer;
            this.appendChild(pElement);
            pElement.player = p;
        });
    }
}

customElements.define('ce-player-list', CePlayerList);