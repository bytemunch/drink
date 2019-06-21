/// <reference path="../index.ts" />

class Page {
    public page: HTMLElement;

    constructor() {
        this.page = document.createElement('div');
        this.page.setAttribute('id', 'pageInner');
    };
}