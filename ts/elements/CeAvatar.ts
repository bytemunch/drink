/// <reference path='UpdateableElement.ts'/>

class CeAvatar extends UpdateableElement {
    constructor() {
        super();
    }

    applyStyle() {
        this.classList.add('account-img');
        this.style.backgroundImage = `url(${userdata.aviImg})`;
        this.style.backgroundSize = 'cover';
    }

    connectedCallback() {
        super.connectedCallback();
        this.applyStyle();
    }

    update() {
        super.update();
        this.style.backgroundImage = `url(${userdata.aviImg})`;
    }
}

customElements.define('ce-avatar', CeAvatar);