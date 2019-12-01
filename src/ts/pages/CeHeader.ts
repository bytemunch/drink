class CeHeader extends HTMLElement {
    constructor() {
        super();
    }

    applyStyles() {
        this.style.position = 'relative';
        this.style.display = 'block';
        this.style.overflow = 'visible';
    }

    connectedCallback() {
        this.addInfo();
        this.addAccountMenu();
        this.addLogo();

        this.applyStyles();
    }

    addLogo() {
        // Logo
        let logo = document.createElement('h1');
        logo.classList.add('logo');
        logo.textContent = 'drink!';
        this.appendChild(logo);
    }

    addAccountMenu() {
        let accountMenu = new CeAccountMenu;
        this.appendChild(accountMenu);
        let accountBtn = new CeAccountButton(accountMenu);
        accountBtn.classList.add('account')
        this.appendChild(accountBtn);
    }

    addInfo() {
        let infoMenu = new CeAboutMenu;
        this.appendChild(infoMenu);
        let infoBtn = new CeShowButton(infoMenu);
        infoBtn.openImg = './img/info.svg';
        infoBtn.classList.add('info','about');
        this.appendChild(infoBtn);
    }

    hideItem(item) {
        (<CeHeader>this.querySelector('.' + item)).style.display = 'none';
    }

    showItem(item) {
        (<CeHeader>this.querySelector('.' + item)).style.display = 'unset';
    }
}

customElements.define('ce-header', CeHeader);