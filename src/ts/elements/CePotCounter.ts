import RedOrBlack from "../class/RedOrBlack.js";
import {gameHandler} from '../index.js';
import CustomElement from "./CustomElement.js";

export default class CePotCounter extends CustomElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.textContent = '0';

        this.applyStyle();
    }

    update() {
        this.textContent = (<RedOrBlack>gameHandler.gameObject).cardPot.length.toString();
    }
}