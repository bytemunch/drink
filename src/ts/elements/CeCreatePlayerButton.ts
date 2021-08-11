import CeShowButton from "./CeShowButton.js";


export default class CeCreatePlayerButton extends CeShowButton {
    constructor(tgt) {
        super(tgt);
        this.openImg = './img/add.svg'
    }

    applyStyle() {
        super.applyStyle();
    }
}