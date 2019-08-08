class UserData {
    name: string = '';
    color: string = '';
    uid: string = '';
    ref;
    aviRef;
    aviImg;


    constructor() { };

    async sendData() {
        // set data in db from this
        return firestore.collection("users").doc(this.uid).set({
            name: this.name,
            color: this.color,
            status: 'online'
            // status: presMan.ref
        }, { merge: true });
    }

    async populateFrom(uid) {
        this.uid = uid;

        this.ref = firestore.collection('users').doc(uid);
        
        // Pull user data into memory
        const userDoc = await this.ref.get()
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

        return userDoc;
    }

}