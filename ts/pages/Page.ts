/// <reference path="../index.ts" />

class Page {
    public page: HTMLElement;

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
        version.textContent = VERSION + (LOCAL_MODE ? ' local' : ' online');

        this.page.appendChild(version)
    };

    addLogo() {
        let logo = document.createElement('h1');
        logo.classList.add('logo');
        logo.textContent = 'logo';
        this.page.appendChild(logo);
    }
}