/// <reference path='Page.ts'/>

class PageName extends Page {
    constructor() {
        super();

        let title = document.createElement('h1');

        title.textContent = `Page Title`;

        this.page.appendChild(title);
    }
}