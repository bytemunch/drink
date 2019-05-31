class UpdateableElement extends HTMLElement {
    
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('updateable-element');
    }

    update() {
        // literally just here to shut typescript up
        // i wanna code fast not well jeez
    }

}