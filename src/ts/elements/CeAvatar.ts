import UpdateableElement from "./UpdateableElement.js";
import { palette } from "../index.js";
import firebase from '../functions/firebase.js';

export default class CeAvatar extends UpdateableElement {
    src;
    color;
    realReady;
    _uid = 'USER_SIGNED_OUT';

    constructor() {
        super();
    }

    applyStyle() {
        super.applyStyle();
    }

    async connectedCallback() {
        await super.connectedCallback();
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

        Promise.all([colorPromise, imgPromise]).then(() => this.update()).catch(e => console.error(e));
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

        try {
            let aviImg = await aviRef.getDownloadURL()
            return aviImg;
        } catch (e) {
            return '/img/noimg.png';
        }
    }

    async getColor() {
        const userDoc = await firebase.firestore().collection('users').doc(this._uid).get()
        const userData = await userDoc.data() || {};

        return userData.color || '#FFFFFF';
    }

    update() {
        super.update();
        this.style.backgroundImage = this.src;
        this.style.borderColor = this.color;
        this.ready = this.realReady;
    }
}