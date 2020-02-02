import CeShowButton from "./CeShowButton.js";


export default class CeCreatePlayerButton extends CeShowButton {
    constructor(tgt) {
        super(tgt);
        this.openImg = './img/add.svg'
    }

    applyStyle() {
        super.applyStyle();
        this.style.position = 'relative';
        this.style.overflow = 'visible';
        this.style.top = 'calc(50% - 16px)';
        this.style.left = 'calc(50% - 16px)';
    }
}

// customElements.define('ce-create-player-button', CeCreatePlayerButton);