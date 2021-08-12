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

        let sharedStylesheet = document.createElement('link');
        sharedStylesheet.href = `./styles/CeSharedStyles.css`;
        sharedStylesheet.rel = "stylesheet";
        this.shadowRoot.appendChild(sharedStylesheet);
    }

    connectedCallback() {
    }
}