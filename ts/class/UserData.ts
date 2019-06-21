class UserData {
    name: string = '';
    color: string = '';
    uid: string = '';
    aviRef;
    aviImg;


    constructor() { };

    async sendData() {
        // set data in db from this
        return db.collection("users").doc(this.uid).set({
            name: this.name,
            color: this.color,
            status: presMan.ref
        }, { merge: true });
    }

    async populateFrom(uid) {
        this.uid = uid;
        
        // Pull user data into memory
        const retval = await db.collection("users").doc(uid).get()
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
            .finally(()=>updateDOM())

        return retval;
    }

}