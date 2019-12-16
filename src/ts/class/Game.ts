class Game {
    players: Object;

    offline: boolean;

    playerOrder: Array<string>;

    turn: number;

    type:string;

    state: string;

    constructor() {
        this.offline = true;
        this.playerOrder = [];
        this.players = {};
        this.turn = 0;
        this.state = 'setup';
    }

    addPlayer(player: Player) {
        this.players[player.uid] = player;

        this.playerOrder.push(player.uid);
    }

    removePlayer(id) {
        id = id.toString();
        delete this.players[id];
        this.playerOrder.splice(this.playerOrder.indexOf(id) - 1, 1);
    }

    modifyPlayer(id, fields) {
        for (let f of fields) {
            this.players[id][f] = fields[f];
        }
    }

    takeTurn() {
        this.turn++;
    }

    get currentPlayer() {
        return this.playerOrder[this.turn%this.playerOrder.length];
    }
}