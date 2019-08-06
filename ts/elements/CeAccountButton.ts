/// <reference path='CeShowHideButton.ts'/>

class CeAccountButton extends CeShowHideButton {
    avi;

    constructor(target) {
        super(target);
    }

    applyStyle() {
        super.applyStyle();
        this.style.background = 'none';
        this.icon.style.display = 'none';
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