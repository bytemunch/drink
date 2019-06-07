/// <reference path='Page.ts'/>

class PlayPage extends Page {
    constructor() {
        super();

        let title = document.createElement('h1');

        title.textContent = `Play`;

        this.page.appendChild(title);
    }
}