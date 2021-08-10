import CeAccountMenu from "./CeAccountMenu.js";
import CeAccountButton from "./CeAccountButton.js";
import CeShowButton from "./CeShowButton.js";
import CeAboutMenu from "./CeAboutMenu.js";
import CustomElement from "./CustomElement.js";

export default class CeHeader extends CustomElement {
    constructor() {
        super();
    }

    applyStyle() {
        this.style.position = 'relative';
        this.style.display = 'block';
        this.style.overflow = 'visible';

        super.applyStyle();
    }

    connectedCallback() {
        this.addInfo();
        this.addAccountMenu();
        this.addLogo();

        this.applyStyle();
    }

    addLogo() {
        // Logo
        let logo = document.createElement('h1');
        logo.classList.add('logo');
        logo.textContent = 'drink!';
        this.shadowRoot.appendChild(logo);
    }

    addAccountMenu() {
        let accountMenu = new CeAccountMenu;
        this.shadowRoot.appendChild(accountMenu);
        let accountBtn = new CeAccountButton(accountMenu);
        accountBtn.classList.add('account')
        this.shadowRoot.appendChild(accountBtn);
    }

    addInfo() {
        let infoMenu = new CeAboutMenu;
        this.shadowRoot.appendChild(infoMenu);
        let infoBtn = new CeShowButton(infoMenu);
        infoBtn.openImg = './img/info.svg';
        infoBtn.classList.add('info','about');
        this.shadowRoot.appendChild(infoBtn);
    }

    hideItem(item) {
        (<CeHeader>this.shadowRoot.querySelector('.' + item)).style.display = 'none';
    }

    showItem(item) {
        (<CeHeader>this.shadowRoot.querySelector('.' + item)).style.display = 'unset';
    }
}