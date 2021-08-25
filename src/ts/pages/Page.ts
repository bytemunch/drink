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

        let version = this.shadowRoot.querySelector('#version');
        version.textContent = VERSION;

        this.applyStyle();
    }
}