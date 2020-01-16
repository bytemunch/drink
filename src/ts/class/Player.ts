class Player {
    name: string = 'Player 1';
    color: string = '#FF00FF';
    uid: string = 'PLAYER_SIGNED_OUT';
    ref;
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
                    // if doc does not exist

                    // set our data from PROVIDER_VARS
                    this.name = PROVIDER_VARS.name;

                    // upload profile pic
                    const storageRef = firebase.storage().ref().child(`avatars/${this.uid}.png`);
                    storageRef.put(await (await fetch(PROVIDER_VARS.avi)).blob())

                    // then send
                    await this.sendData();
                    this.getData(await this.ref.get());
                }
            })
            .catch(e => console.error(e))
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
            name: this.name,
            color: this.color,
            uid: this.uid
        }
    }

}