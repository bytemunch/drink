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
            let turnOrder = room.data.turnOrder;
            if (turnOrder.length == Object.keys(room.data.players).length) {// JS casting doing bits here ugh
                const pIdx = turnOrder.indexOf(players[p].uid);
                pIdx==-1?this.players.push(players[p]):this.players[pIdx] = players[p];
            } else {
                this.players.push(players[p]);
            }
        }

        // Re-order array if turns have been taken
        let tmp;
        console.log(this.players);
        for (let i=0;i<room.data.turnCounter;i++) {
            tmp = this.players.shift();
            console.log(tmp);
            this.players.push(tmp);
        }
        console.log(this.players);

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