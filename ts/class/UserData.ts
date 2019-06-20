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

    async getAvi(uid=this.uid) {
        this.aviRef = firebase.storage().ref().child(`avatars/${uid}.png`);
        this.aviRef.getDownloadURL()
            .then(async url => {
                console.log(url);

                this.aviImg = url;//URL.createObjectURL(url);
            })
            .catch(e => {
                console.error(e);
                // set aviImg to default
                this.aviImg = '/img/noimg.png';
            })
            .finally(() => {
                updateDOM();
            })
    }

    async populateFrom(uid) {
        this.uid = uid;
        this.getAvi(uid);
        
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

        return retval;
    }

}