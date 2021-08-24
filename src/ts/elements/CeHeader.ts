import CeAccountButton from "./CeAccountButton.js";
import CeShowButton from "./CeShowButton.js";
import CustomElement from "./CustomElement.js";

export default class CeHeader extends CustomElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        await super.connectedCallback();

        let infoBtn = this.shadowRoot.querySelector('#show-about') as CeShowButton;
        infoBtn.target = this.shadowRoot.querySelector('ce-about-menu');
        infoBtn.img = './img/info.svg';

        let accBtn = this.shadowRoot.querySelector('ce-account-button') as CeAccountButton;
        accBtn.target = this.shadowRoot.querySelector('ce-account-menu');

        this.applyStyle();
    }

    hideItem(item) {
        (<CeHeader>this.shadowRoot.querySelector('.' + item)).style.display = 'none';
    }

    showItem(item) {
        (<CeHeader>this.shadowRoot.querySelector('.' + item)).style.display = 'unset';
    }
}