/// <reference path='Page.ts'/>

class HomePage extends Page {
    constructor() {
        super();

        let title = document.createElement('h1');

        title.textContent = `Hello${userdata.name?' '+userdata.name:''}.`;

        this.page.appendChild(title);

    }
}