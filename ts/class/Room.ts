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

        return db.collection('rooms').doc(this.roomId).get()
            .then(doc => {
                this.data = doc.data();
                updateDOM();
                loadMan.killLoader('roomJoined');
                this.listener = db.collection('rooms').doc(this.roomId).onSnapshot(doc => {
                    const oldData = this.data;
                    const newData = doc.data();
                    newData?this.data=newData:this.listener();
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

    async create() {
        return firebase.auth().currentUser.getIdToken(true)
            .then(token => {
                return easyPOST('createRoom', { token })
            })
            .then(res => res.json())
        // .then(data => console.log(data))

        // TODO after room created success start listening to changes on room ref
        // When changes detected grab PIN as we should be owner
        // Then go ahead and join the room
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
                            errorPopUp(e.err + ' Code: '+e.code);
                            console.log('INFO: ', e);

                            return e;
                        }

                        // I think this is safe but I'm not sure...
                        // need to make sure there's only one of these for each recursion
                        if (firstRun) {
                            let unsubscribe = db.collection('rooms').doc(roomId)
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


}