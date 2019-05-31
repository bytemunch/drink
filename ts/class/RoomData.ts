class RoomData {
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
                this.listener = db.collection('rooms').doc(this.roomId).onSnapshot(doc => {
                    this.data = doc.data()
                    // blanket update everything OR specific updates?
                    // BOTH!!
                })
            })


    }


}