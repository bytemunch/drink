/// <reference path="../index.ts" />

class Page {
    public page: HTMLElement;
    aboutBtn;

    constructor() {
        this.page = document.createElement('div');
        this.page.setAttribute('id', 'pageInner');

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

        this.page.appendChild(version);

        // feedback menu
        let aboutMenu = new CeAboutMenu;

        // feedback button
        this.aboutBtn = new CeShowButton(aboutMenu);
        this.aboutBtn.openImg = './img/info.svg';
        this.aboutBtn.classList.add('about');

        this.page.appendChild(aboutMenu);
        this.page.appendChild(this.aboutBtn);
    };

    addLogo() {
        let logo = document.createElement('h1');
        logo.classList.add('logo');
        logo.textContent = 'drink!';
        this.page.appendChild(logo);
    }
}