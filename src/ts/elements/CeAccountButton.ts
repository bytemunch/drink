import CeShowButton from "./CeShowButton.js";
import CeAvatar from "./CeAvatar.js";

import {userdata} from '../index.js';

export default class CeAccountButton extends CeShowButton {
    avi;

    constructor(target) {
        super(target);
    }

    applyStyle() {
        super.applyStyle();

        this.classList.add('updateable-element');
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.avi = new CeAvatar;
        
        this.shadowRoot.appendChild(this.avi);
        this.update();
        this.applyStyle();
    }

    update() {
        this.avi.uid = userdata.uid;
    }
}