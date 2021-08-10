export default class CustomElement extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
    }

    applyStyle() {
        let newStyle = document.createElement('link');
        newStyle.href = `./styles/${this.constructor.name}.css`;
        newStyle.rel = "stylesheet";
        this.shadowRoot.appendChild(newStyle);
    }

    connectedCallback() {
    }
}