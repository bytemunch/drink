import CustomElement from "./CustomElement.js";

export default class UpdateableElement extends CustomElement {
    
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('updateable-element');
    }

    update() {
        // literally just here to shut typescript up
        // i wanna code fast not well jeez
    }

}