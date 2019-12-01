class CePage extends HTMLElement {
    header = 'full';

    constructor() {
        super();
    }

    applyStyle() {
    }

    connectedCallback() {
        this.classList.add('page');
    }
}

customElements.define('ce-page',CePage);