class Player {
    name: string = 'Player 1';
    color: string = '#FF00FF';
    uid: string = 'PLAYER_SIGNED_OUT';
    ref;
    aviRef;
    aviImg;
    extraPlayerCount: number = 0;

    constructor(options?) {
        this.extraPlayerCount = 0;
        for (let o in options) {
            this[o] = options[o];
        }
    };

    async sendData() {
        // set data in db from this
        return firestore.collection("users").doc(this.uid).set(this.safeData, { merge: true });
    }

    async populateFrom(uid) {
        this.uid = uid;

        this.ref = firestore.collection('users').doc(uid);

        // Pull user data into memory
        const userDoc = await this.ref.get()
            .then(async (doc: any) => {
                if (doc.exists) {
                    this.getData(doc);
                } else {
                    await this.sendData();
                    this.getData(await this.ref.get());
                }
            })
            .catch(e=>console.error(e))
            .finally(() => updateDOM())

        return userDoc;
    }

    getData(doc) {
        let retrievedData = doc.data();

        for (let field in retrievedData) {
            this[field] = retrievedData[field];
        }
    }

    get safeData() {
        return {
            name :this.name,
            color: this.color,
            uid: this.uid
        }
    }

}