class CustomElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('responsive-reflow'); // reflow everything as test
        // this.attachShadow({mode:'open'});
    }

}