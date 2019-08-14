class CeCreatePlayerButton extends CeShowHideButton {
    constructor(tgt) {
        super(tgt);
        this.openImg = './img/add.svg'
    }

    applyStyle() {
        super.applyStyle();
        this.style.position = 'relative';
        this.style.zIndex = '9';
    }
}

customElements.define('ce-create-player-button', CeCreatePlayerButton);