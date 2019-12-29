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
        getColor(uid)
        .then(color => {
            this.color = color;
            this.update();
        })
        getAvatar(uid)
            .then(url => {
                this.src = `url(${url})`;
                this.update();
            })

        this._uid = uid;
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

    update() {
        super.update();
        this.applyStyle();
    }
}

customElements.define('ce-avatar', CeAvatar);