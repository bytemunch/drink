class UserData {
    name: string = '';
    color: string = '';
    avatar: string = '';
    uid: string = '';

    constructor() { };

    async sendData() {
        // set data in db from this
        return db.collection("users").doc(this.uid).set({
            name: this.name,
            color: this.color,
            avatar: this.avatar
        }, { merge: true });
    }

    async populateFrom(uid) {
        this.uid = uid;
        // Pull user data into memory
        return await db.collection("users").doc(uid).get()
            .then((doc: any) => {
                if (doc.exists) {
                    let retrievedData: any = doc.data();

                    for (let field in retrievedData) {
                        this[field] = retrievedData[field];
                    }

                    return true;
                } else {
                    this.sendData();
                    return false;
                }

            })
    }

}