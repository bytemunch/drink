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
    clicked() {
        super.clicked();
        this.style.zIndex = this.openState ? '11' : '9';
        this.style.position = this.openState ? 'fixed' : 'relative';
    }
}

customElements.define('ce-create-player-button', CeCreatePlayerButton);