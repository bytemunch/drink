class Room {
    public roomId;
    public data;
    private listener;
    public initialised;

    constructor() {
    }

    init(roomId) {
        this.roomId = roomId;

        console.log(`Joined ${roomId}!`);

        return firestore.collection('rooms').doc(this.roomId).get()
            .then(doc => {
                this.data = doc.data();
                updateDOM();
                loadMan.killLoader('roomJoined');
                this.listener = firestore.collection('rooms').doc(this.roomId).onSnapshot(doc => {
                    const oldData = this.data;
                    const newData = doc.data();
                    newData ? this.data = newData : this.listener();
                    // blanket update everything OR specific updates?
                    // BOTH!!

                    if (oldData.state !== this.data.state) {
                        console.log('State change:', oldData.state, this.data.state)
                        if (oldData.state == 'lobby' && this.data.state == 'playing') {
                            openPage('play');
                        }

                        if (oldData.state == 'playing' && this.data.state == 'finished') {
                            //openPage('finished');
                        }
                    }

                    // Somewhere here decide if we're changing pages based on data
                    updateDOM();// pass data to function to save cycles?
                })
            })
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
                return { err: `You already own room ${room}!` };
            }
        }

        roomId = roomId || randomId(roomsArray);

        while (roomsArray.includes(roomId)) {
            roomId = randomId(roomsArray);
        }

        // If available set to unavailable
        roomsInfoRef.set({roomlist:{[roomId]: userdata.uid}},{merge:true})

        // Return roomId
        if (false) return { err: 'Test error!' };
        return { err: false, id: roomId };
    }

    // snap.ref.set({

    // }, { merge: true })

    async createLocal() {
        const roomId = await this.createID();

        const deck = new Deck;

        const rules = new RuleSet('IRL');

        const newRoom = {
            owner: userdata.uid,
            state: 'lobby',
            turnCounter: 0,
            turnOrder: [],
            currentCard: {},
            players: {},

            pin: '0000',

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
            console.error(e)
        }

        return roomId;
    }

    // async join(roomId: string, pin: string, firstRun = true) {
    async join(params: Array<any>) {
        const roomId = params[0];
        const pin = params[1];
        const firstRun = params[2] || true;

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

                        let allowedErrors = ['425'];

                        if (allowedErrors.indexOf(e.code) == -1) {
                            loadMan.killLoader('roomJoined');
                            // SHOW USER ERROR
                            errorPopUp(e.err + ' Code: ' + e.code);
                            console.log('INFO: ', e);

                            return e;
                        }

                        // I think this is safe but I'm not sure...
                        // need to make sure there's only one of these for each recursion
                        if (firstRun) {
                            let unsubscribe = firestore.collection('rooms').doc(roomId)
                                .onSnapshot(change => {
                                    let state = change.data() ? change.data().state : null
                                    if (state && state == 'lobby') {
                                        this.join([roomId, pin, false]);
                                        unsubscribe();
                                    }
                                })
                        }

                    });
            })

        // TODO rate limiting to prevent bruteforce room entry
        // as it would only take 26^4*10000 attempts to find any single room + pin
        // also even pentesting that would far exceed my quotas
        // i need a revenue stream fffffffffffffff

        // TODO setup security to prevent room snooping from non owners
        // > and people that haven't joined yet

    }

    async getAvi(uid) {
        const aviRef = firebase.storage().ref().child(`avatars/${uid}.png`);

        return aviRef.getDownloadURL()
            .then(async url => {
                return url;//URL.createObjectURL(url);
            })
            .catch(e => {
                console.error(e);
                // set aviImg to default
                return '/img/noimg.png';
            })
    }


}