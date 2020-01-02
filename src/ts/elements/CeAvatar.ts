/// <reference path='UpdateableElement.ts'/>

class CeAvatar extends UpdateableElement {
    src;
    color;
    realReady;
    _uid;

    constructor(uid = userdata.uid) {
        super();
    }

    applyStyle() {
        this.style.backgroundImage = this.src;
        this.style.backgroundSize = 'cover';
        this.style.borderColor = this.color;
        this.ready = this.realReady;
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('account-img');
        this.applyStyle();
    }

    set uid(uid) {
        this._uid = uid;

        let colorPromise = this.getColor()
            .then(color => {
                this.color = color;
            })


        let imgPromise = this.getAvatar()
            .then(url => {
                this.src = `url(${url})`;
            })

        Promise.all([colorPromise,imgPromise]).then(()=>this.update()).catch(e=>console.error(e));
    }

    set ready(bool) {
        this.realReady = bool;
        if (bool === true) {
            this.style.borderTopColor = palette.green;
            this.style.borderBottomColor = palette.green;
        } else if (bool === false) {
            this.style.borderTopColor = palette.red;
            this.style.borderBottomColor = palette.red;
        }
    }

    async getAvatar() {
        const aviRef = firebase.storage().ref().child(`avatars/${this._uid}.png`);

        let aviImg = await aviRef.getDownloadURL()
            .catch(e => {
                //console.error(e);
                return '/img/noimg.png';
            })
        return aviImg;
    }

    async getColor() {
        const userDoc = await firestore.collection('users').doc(this._uid).get()
        const userData = await userDoc.data();

        return userData.color;
    }

    update() {
        super.update();
        this.applyStyle();
    }
}

customElements.define('ce-avatar', CeAvatar);