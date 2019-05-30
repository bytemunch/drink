class RoomData {
    public roomId;
    public data;
    constructor() {

    }

    init(roomId) {
        this.roomId = roomId;

        console.log(`Joined ${roomId}!`);

        db.collection('rooms').doc(this.roomId).onSnapshot(doc=>{
                this.data = doc.data();
            })
    }

    getRoomData() {
        // Pull data from firestore into this object
    }

    
}