import Player from "./Player.js";
import firebase, { firestore } from '../functions/firebase.js';
import goToPage from "../functions/goToPage.js";
import easyPOST from "../functions/easyPOST.js";
import { userdata } from "../index.js";
import getProps from "../functions/getProps.js";
import strip from "../functions/strip.js";

export default class Game {
    players: Object;

    ownerUid: string;

    playerOrder: Array<string>;

    turn: number;

    type: string;

    state: string;

    online: boolean;

    roomId: string;

    pin: string;

    view: HTMLElement;

    ref;

    batchedUpdate: any = {};

    constructor(online = false, roomId?, roomPin?) {
        this.online = online;
        this.playerOrder = [];
        this.players = {};
        this.turn = 0;
        this.state = 'setup';

        this.addPlayer(userdata);

        if (this.online) {
            this.roomId = roomId || this.createId();
            this.pin = roomPin || this.createPin();
            this.ownerUid = userdata.uid;
        }
    }

    addPlayer(player: Player) {
        this.players[player.uid] = player.safeData;

        this.playerOrder.push(player.uid);

        if (this.ref && this.online) {
            this.batchFirebase({ players: this.players, playerOrder: this.playerOrder });
            this.updateFirebase();
        }

    }

    async removePlayer(uid) {
        delete this.players[uid];
        this.playerOrder.splice(this.playerOrder.indexOf(uid), 1);

        if (this.online) {
            // remove local player from firebase
            this.batchFirebase({ players: this.players, playerOrder: this.playerOrder });
            this.updateFirebase();
        }

        return;
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

        this.GAME_CHANGE_LISTENER();

        goToPage('pg-home');
    }

    batchFirebase(data) {
        Object.assign(this.batchedUpdate, strip(data));
    }

    updateFirebase() {
        return this.ref.update(strip(this.batchedUpdate));
    }

    async takeTurn() {
        this.turn++;
        if (this.online) {
            this.batchFirebase({ turn: this.turn });
            this.updateFirebase();
        }

        
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
        let state = JSON.parse(JSON.stringify(getProps(this, ['ref'])));

        state.currentPlayer = this.currentPlayer;
        state.previousPlayer = this.previousPlayer;

        return state;
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

    GAME_CHANGE_LISTENER() { console.log('no listener') };


    async joinRoom() {
        const token = await firebase.auth().currentUser.getIdToken();
        const response = await easyPOST('joinRoom', { pin: this.pin, roomId: this.roomId, token })
            .then(res => res.json())

        if (response.joined) {
            // set up listener
            this.GAME_CHANGE_LISTENER();// clear previous listener
            this.GAME_CHANGE_LISTENER = firestore.collection('rooms').doc(this.roomId).onSnapshot(doc => {
                let oldData = getProps(this, 'ref');
                let newData = doc.data();

                this.onListenerUpdate(newData, oldData);
            })
        }

        return response;
    }

    onListenerUpdate(newData, oldData) {

    }
}