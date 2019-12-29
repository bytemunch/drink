class Game {
    players: Object;

    playerOrder: Array<string>;

    turn: number;

    type: string;

    state: string;

    online: boolean;

    roomId: string;

    pin: string;

    ref;

    constructor(online = false, roomId?, roomPin?) {
        this.online = online;
        this.playerOrder = [];
        this.players = {};
        this.turn = 0;
        this.state = 'setup';

        this.addPlayer(userdata);

        if (this.online) {
            this.roomId = roomId || 'TEST';
            this.pin = roomPin || '0000';
        }
    }

    addPlayer(player: Player) {
        this.players[player.uid] = player.safeData;

        this.playerOrder.push(player.uid);
    }

    async removePlayer(uid) {
        delete this.players[uid];
        this.playerOrder.splice(this.playerOrder.indexOf(uid) - 1, 1);

        if (this.online) {
            // remove local player from firebase
        }

        return true;
    }

    modifyPlayer(id, fields) {
        for (let f of fields) {
            this.players[id][f] = fields[f];
        }
    }

    async leave() {
        const players = this.players;

        let newPlayers = { ...players };

        let playersToRemove = [];

        for (let playerUid in players) {
            if (playerUid.includes(userdata.uid)) {
                delete newPlayers[playerUid];
                playersToRemove.push(playerUid);
            }
        }

        await this.ref.update({
            players: newPlayers,
            playerOrder: firebase.firestore.FieldValue.arrayRemove(...playersToRemove)
        });

        GAME_CHANGE_LISTENER();

        goToPage('ce-home-page');
    }

    async takeTurn() {
        this.turn++;
        if (this.online) return this.ref.set({ turn: this.turn }, { merge: true });
    }

    get numPlayers() {
        return this.playerOrder.length;
    }

    get currentPlayer() {
        return this.playerOrder[this.turn % this.numPlayers];
    }

    get previousPlayer() {
        let prevIdx = (this.numPlayers - 1 + this.turn) % this.numPlayers;

        return this.playerOrder[prevIdx];
    }

    createId() {
        let str = '';
        for (let i = 0; i < 4; i++) {
            str = str + String.fromCharCode(Math.ceil((Math.random()) * 26) + 64);
        }

        // TODO if str is existing room, repeat
        if (false) {
            return this.createId();
        }

        return str;
    }

    createPin() {
        let str = '';
        for (let i = 0; i < 4; i++) {
            str = str + Math.floor((Math.random()) * 10);
        }

        return str;
    }

    get fullState() {
        return JSON.parse(JSON.stringify(getProps(this, ['ref'])))
    }

    get link() {
        return 'https://drink-with.us/faq/';
    }

    async createRoom() {
        return this.ref.set(this.fullState);
    }

    async initOnline(create) {
        // create room if not existing
        this.ref = firestore.collection('rooms').doc(this.roomId);

        if (await this.ref.get().then(d => d.data()) == undefined) {
            if (create) {
                await this.createRoom();
            } else {
                throw 'Room does not exist!';
            }
        } else if (create) {
            // room exists
            throw 'Room already exists!';
        }

        return this.joinRoom();
    }

    async joinRoom() {
        const token = await firebase.auth().currentUser.getIdToken();
        const response = await easyPOST('joinRoom', { pin: this.pin, roomId: this.roomId, token })
            .then(res => res.json())

        if (response.joined) {
            // set up listener
            GAME_CHANGE_LISTENER();// clear previous listener
            GAME_CHANGE_LISTENER = firestore.collection('rooms').doc(this.roomId).onSnapshot(doc => {
                let oldData = getProps(this, 'ref');
                let newData = doc.data();

                this.onListenerUpdate(newData, oldData);
            })
        }

        return response;
    }

    onListenerUpdate(newData, oldData) {
        for (let prop in oldData) {
            if (prop == 'deck') { // fix for killing deck object TODO deck.update(newCards) or deck.remove(card)
                if (newData['deck'].cards !== oldData['deck'].cards) this['deck'].cards = newData['deck'].cards;
            } else {
                if (newData[prop] !== oldData[prop]) this[prop] = newData[prop]
            }
        }
    }
}