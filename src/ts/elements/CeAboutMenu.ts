/// <reference path='CeMenu.ts'/>

class CeAboutMenu extends CeMenu {
    constructor() {
        super();
    }

    applyStyle() {
        super.applyStyle();
    }

    connectedCallback() {
        super.connectedCallback();
        let title = document.createElement('h1');
        title.textContent = 'About';
        title.style.position = 'relative';
        title.style.pointerEvents = 'none';
        this.menu.appendChild(title);

        this.logoutBtn.style.display = 'none';

        let desc = document.createElement('p');
        desc.textContent = 'Drink! is the drinking game app that you\'ve been missing. It\'ll be fully customizable and easy to pick up with a multitude of games when it\'s finished.';
        desc.style.padding = '0 20px';
        this.menu.appendChild(desc);

        let faqLink = document.createElement('a');
        faqLink.href = location.origin + '/faq';
        faqLink.textContent = 'F.A.Q';
        this.menu.appendChild(faqLink);

        let authorLink = document.createElement('a');
        authorLink.href = 'https://sam.edelsten.me/';
        authorLink.target = '_blank';
        authorLink.textContent = 'Who Made This?';
        this.menu.appendChild(authorLink);

        let feedbackLink = document.createElement('a');
        feedbackLink.href = 'mailto:sam.drink.app@gmail.com';
        feedbackLink.target = '_blank';
        feedbackLink.textContent = 'Feedback';
        this.menu.appendChild(feedbackLink);

        this.applyStyle();
    }
}

customElements.define('ce-about-menu', CeAboutMenu);