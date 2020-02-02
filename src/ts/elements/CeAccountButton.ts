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

        this.style.background = 'none';
        this.icon.style.display = 'none';

        this.style.position = 'absolute';
        this.style.left = 'calc(99% - 32px)';
        this.style.top = '1vw';
    }

    connectedCallback() {
        super.connectedCallback();
        this.avi = new CeAvatar;
        
        this.appendChild(this.avi);
        this.update();
        this.applyStyle();
    }

    clicked() {
        super.clicked();
        this.style.background = 'none';
    }

    update() {
        this.avi.uid = userdata.uid;
    }
}

// customElements.define('ce-account-button', CeAccountButton);