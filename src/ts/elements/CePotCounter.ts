import UpdateableElement from "./UpdateableElement.js";
import RedOrBlack from "../class/RedOrBlack.js";
import {gameHandler} from '../index.js';

export default class CePotCounter extends UpdateableElement {
    constructor() {
        super();
    }

    applyStyle() {
        this.style.display = 'block';
        this.style.position = 'absolute';
        this.style.borderRadius = '1000px'; //circle
        this.style.color = 'yellow';
        this.style.zIndex = '5';
        this.style.fontSize = '26pt';
        this.style.textAlign = 'center';
        this.style.lineHeight = '270%';
        this.style.opacity = '0.9';
    }

    connectedCallback() {
        this.classList.add('red');
        this.textContent = '0';

        this.applyStyle();
    }

    update() {
        this.textContent = (<RedOrBlack>gameHandler.gameObject).cardPot.length.toString();
    }
}

// customElements.define('ce-pot-counter', CePotCounter);