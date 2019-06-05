/// <reference path='CustomElement.ts'/>

class CePlayerReady extends CustomElement {

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.style.backgroundColor = 'red';
        this.applyStyles();
    }

    applyStyles() {
        this.style.height = '4vh';
        this.style.width = '4vh';
        this.style.overflow = 'hidden';
        this.style.borderRadius = '100px';
        this.style.position = 'absolute';
        this.style.right = '2%';
        this.style.top = '10%';
    }

    beReady() {
        this.style.backgroundColor = 'green';
    }

    unReady() {
        this.style.backgroundColor = 'red';
    }

    set ready (bool) {
        bool?this.beReady():this.unReady();
    }
}

customElements.define('ce-player-ready', CePlayerReady);