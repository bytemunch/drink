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
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.avi = this.shadowRoot.querySelector('ce-avatar');
        this.update();
        this.applyStyle();
    }

    update() {
        this.avi.uid = userdata.uid;
    }
}