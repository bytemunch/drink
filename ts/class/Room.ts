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
                this.listener = db.collection('rooms').doc(this.roomId).onSnapshot(doc => {
                    this.data = doc.data()
                    // blanket update everything OR specific updates?
                    // BOTH!!
                    updateDOM();// pass data to function to save cycles?
                })
            })
    }

    
async create() {
    const roomId = await getRoomId().catch(e => console.error(e));

    return firebase.auth().currentUser.getIdToken(true)
        .then(token => {
            return easyPOST('createRoom', { token, roomId })
        })
        .then(res => res.json())
    // .then(data => console.log(data))

    // TODO after room created success start listening to changes on room ref
    // When changes detected grab PIN as we should be owner
    // Then go ahead and join the room
}

async join(roomId: string, pin: string, firstRun = true) {
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

                    // I think this is safe but I'm not sure...
                    // need to make sure there's only one of these for each recursion
                    if (firstRun) {
                        let unsubscribe = db.collection('rooms').doc(roomId)
                            .onSnapshot(change => {
                                let state = change.data() ? change.data().state : null
                                if (state && state == 'lobby') {
                                    this.join(roomId, pin, false);
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