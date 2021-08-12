import UpdateableElement from "./UpdateableElement.js";
import RedOrBlack from "../class/RedOrBlack.js";
import {gameHandler} from '../index.js';

export default class CePotCounter extends UpdateableElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.textContent = '0';

        this.applyStyle();
    }

    update() {
        this.textContent = (<RedOrBlack>gameHandler.gameObject).cardPot.length.toString();
    }
}