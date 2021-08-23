import CustomElement from '../elements/CustomElement.js';
import {VERSION} from '../index.js'

export default class Page extends CustomElement {
    header = 'full';

    constructor() {
        super();
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.classList.add('page');

        let version = document.createElement('p');
        version.style.position = 'absolute';
        version.style.color = 'rgba(0,0,0,0.3)';
        version.style.top = '0';
        version.style.left = '0';
        version.style.textAlign = 'center';
        version.style.fontSize = 'small';
        version.style.zIndex = '100';
        version.style.pointerEvents = 'none';
        version.textContent = VERSION;

        this.shadowRoot.appendChild(version);

        this.applyStyle();
    }
}