import RedOrBlack from "../class/RedOrBlack.js";
import {gameHandler} from '../index.js';
import CustomElement from "./CustomElement.js";

export default class CePotCounter extends CustomElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.shadowRoot.querySelector('p').textContent = "0";

        this.applyStyle();
    }

    update() {
        this.shadowRoot.querySelector('p').textContent = (<RedOrBlack>gameHandler.gameObject).cardPot.length.toString();
    }
}