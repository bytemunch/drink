class Room {
    public roomId;
    public data;
    private killListener;
    public initialised;
    ref;

    constructor() {
    }

    init(roomId) {
        this.roomId = roomId;

        console.log(`Joined ${roomId}!`);

        this.ref = firestore.collection('rooms').doc(this.roomId);

        return this.ref.get()
            .then(doc => {
                this.data = doc.data();
                updateDOM();
                killLoader('roomJoined');
                this.killListener = firestore.collection('rooms').doc(this.roomId).onSnapshot(doc => {
                    const oldData = this.data;
                    const newData = doc.data();
                    newData ? this.data = newData : this.killListener();
                    // blanket update everything OR specific updates?
                    // BOTH!!

                    if (oldData.state !== this.data.state) {
                        console.log('State change:', oldData.state, this.data.state)
                        if (oldData.state == 'lobby' && this.data.state == 'playing') {
                            openPage('play');
                        }
                    }

                    // Somewhere here decide if we're changing pages based on data
                    updateDOM();// pass data to function to save cycles?
                })
            })
            .catch(e => console.error('room.init:', e))
    }

    async createID(roomId = '') {
        // helper fn
        function randomId(roomsArray) {
            let str = '';
            for (let i = 0; i < 4; i++) {
                str = str + String.fromCharCode(Math.ceil((Math.random()) * 26) + 64);
            }

            if (roomsArray.includes(str)) return randomId(roomsArray);
            return str;
        }

        // Get roomsinfo
        const roomsInfoRef = firestore.collection('rooms').doc('roomsinfo')
        const roomsinfoDoc = await roomsInfoRef.get()
        const roomsinfo = await roomsinfoDoc.data()
        const roomlist = roomsinfo.roomlist
        const roomsArray = Object.keys(roomlist);

        for (let room in roomlist) {
            // Check if we already own a room
            if (roomlist[room] == userdata.uid) {
                // TESTING 
                // return { err: `You already own room ${room}!` };
            }
        }

        roomId = roomId || randomId(roomsArray);

        while (roomsArray.includes(roomId)) {
            roomId = randomId(roomsArray);
        }

        // If available set to unavailable
        roomsInfoRef.set({ roomlist: { [roomId]: userdata.uid } }, { merge: true })
            .catch(e => {
                console.error('roomsInfoRef.set:', e)
            })

        // Return roomId
        if (false) return { err: 'Test error!' };
        return { err: false, id: roomId };
    }

    async createPin(pin = '') {
        if (pin) return pin;

        const randNum = function () {
            return Math.floor(Math.random() * 10);
        }

        return "" + randNum() + randNum() + randNum() + randNum();
    }

    async createLocal() {
        const roomId = await this.createID();
        const roomPin = await this.createPin();

        const deck = new Deck;

        const rules = new RuleSet('IRL');

        const newRoom = {
            owner: userdata.uid,
            state: 'lobby',
            turnCounter: 0,
            turnOrder: [],
            currentCard: {},
            players: {},

            pin: roomPin,

            timestamp: {
                created: Date.now(),
                modified: Date.now()
            },

            deck: deck.cards,
            rules: rules.rules,
            winState: rules.winState,

        }

        try {
            await firestore.collection('rooms').doc(roomId.id).set(newRoom)
        } catch (e) {
            console.error('Room.createLocal:', e)
        }

        return roomId;
    }

    async join(roomId, pin) {
        // REFAC put this in the userdata class?
        if (!roomId) return Promise.reject('requestJoinRoom: No Room ID provided!');
        if (!pin) return Promise.reject('requestJoinRoom: No Room PIN provided!');

        firebase.auth().currentUser.getIdToken(true)
            .then(token => {
                // Send data to cloud function to compare PIN
                easyPOST('joinRoom', { pin, roomId, token })
                    .then(res => { return res.json() })
                    .then(data => {
                        if (!data.joined) {
                            return Promise.reject(data.error);
                        }
                        userdata.ref.update({
                            prevRoom: '',
                            prevPIN: ''
                        })
                        return room.init(roomId); //TODO promisify init
                    })
                    .then(() => {
                        // RoomData is initialised here
                        // go to lobby I guess
                        openPage('lobby')
                    })
                    .catch(e => {
                        console.error(e);
                        // TODO send useful error codes in e
                        // DO NOT subscribe to changes on any error other than
                        // room preparing (425 too early)

                        killLoader('roomJoined');
                        // SHOW USER ERROR
                        errorPopUp(e.err + ' Code: ' + e.code);
                        userdata.ref.update({ prevPIN: '', prevRoom: '' })
                        openPage('home');
                        console.log('INFO: ', e);

                        return e;
                    });
            })

        // TODO rate limiting to prevent bruteforce room entry
        // as it would only take 26^4*10000 attempts to find any single room + pin
        // also even pentesting that would far exceed my quotas
        // i need a revenue stream fffffffffffffff

        // TODO setup security to prevent room snooping from non owners
        // > and people that haven't joined yet

    }

    async addLocalPlayer(playerInfo) {
        playerInfo.ready = true;

        return this.ref.set({
            players: { [playerInfo.uid]: playerInfo },
            turnOrder: firebase.firestore.FieldValue.arrayUnion(playerInfo.uid)
        }, { merge: true })
    }

    async dropLocalPlayer(uid) {
        const players = this.data.players;

        let newPlayers = { ...players };

        delete newPlayers[uid];

        const roomUpdated = this.ref.update({
            players: newPlayers,
            turnOrder: firebase.firestore.FieldValue.arrayRemove(uid)
        })

        return roomUpdated;
    }

    async leave() {
        // Don't need to wait for response cos we gone
        // But what if we join a new room before response recieved?
        // Then we're fucked
        // Wait for now I guess
        addLoader('pageOpen');
        this.killListener();
        // await easyPOST('reqLeaveRoom', { uid: userdata.uid, roomId: this.roomId });

        const players = this.data.players;

        let newPlayers = { ...players };

        let playersToRemove = [];

        for (let playerUid in players) {
            if (playerUid.includes(userdata.uid)) {
                delete newPlayers[playerUid];
                playersToRemove.push(playerUid);
            }
        }

        const roomUpdated = this.ref.update({
            players: newPlayers,
            turnOrder: firebase.firestore.FieldValue.arrayRemove(...playersToRemove)
        })

        const userUpdated = userdata.ref.set({ currentRoom: '', prevRoom: '', prevPIN: '' }, { merge: true })

        await Promise.all([roomUpdated, userUpdated]);

        this.data = false;
        openPage('home');
        // window.location.href = window.location.origin;
    }

    async getAvi(uid) {
        const aviRef = firebase.storage().ref().child(`avatars/${uid}.png`);

        return aviRef.getDownloadURL()
            .then(async url => {
                return url;//URL.createObjectURL(url);
            })
            .catch(e => {
                //console.error(e);
                // set aviImg to default
                return '/img/noimg.png';
            })
    }

    get link() {
        return `${location.origin}/?r=${this.roomId}&p=${this.data.pin}`;
    }

    get nextPlayer() {
        const nextPlayerIndex = room.data.turnCounter % room.data.turnOrder.length;
        const nextUid = room.data.turnOrder[nextPlayerIndex];
        let playerObject = room.data.players[nextUid];
        playerObject.uid = nextUid;

        return playerObject;
    }

}