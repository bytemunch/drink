export default class CustomElement extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
    }

    applyStyle() {
        // Shared styles; Least important
        let sharedStylesheet = document.createElement('link');
        sharedStylesheet.href = `./styles/CeSharedStyles.css`;
        sharedStylesheet.rel = "stylesheet";
        this.shadowRoot.appendChild(sharedStylesheet);

        // Inherit styles from parent classes
        let parentClass = Object.getPrototypeOf(Object.getPrototypeOf(this));
        let parentClassName = parentClass.constructor.name;

        let parentStyles = [];

        while (parentClassName !== 'CustomElement') {
            let newStyle = document.createElement('link');
            newStyle.rel = "stylesheet";
            newStyle.href = `./styles/${parentClassName}.css`;

            parentStyles.push(newStyle);

            parentClass = Object.getPrototypeOf(parentClass);
            parentClassName = parentClass.constructor.name;
        }

        // reverse for correct priority
        parentStyles.reverse().forEach(style=>this.shadowRoot.appendChild(style));

        // Add own styles

        let newStyle = document.createElement('link');
        newStyle.href = `./styles/${this.constructor.name}.css`;
        newStyle.rel = "stylesheet";
        this.shadowRoot.appendChild(newStyle);
    }

    connectedCallback() {
    }
}