/// <reference path='CeShowButton.ts'/>

class CeAccountButton extends CeShowButton {
    avi;

    constructor(target) {
        super(target);
    }

    applyStyle() {
        super.applyStyle();
        this.style.background = 'none';
        this.icon.style.display = 'none';

        this.style.position = 'relative';
        this.style.left = 'calc(99% - 32px)';
        this.style.top = '1vw';
    }

    connectedCallback() {
        super.connectedCallback();
        this.avi = new CeAvatar;
        this.avi.uid = userdata.uid;
        this.appendChild(this.avi);

        this.applyStyle();
    }

    clicked() {
        super.clicked();
        this.style.background = 'none';
    }
}

customElements.define('ce-account-button', CeAccountButton);