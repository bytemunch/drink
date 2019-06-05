/// <reference path='CustomElement.ts'/>

interface ICePlayerElements {
    name:HTMLElement,
    ready:HTMLElement,
    avatar:HTMLElement,
}

class CePlayer extends CustomElement {
    elements:ICePlayerElements = {
        name : document.createElement('h3'),
        ready : document.createElement('ce-player-ready'),
        avatar : document.createElement('img')
    };

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();

        for (let e in this.elements) {
            this.appendChild(this.elements[e]);
        }

        this.applyStyles();
    }

    applyStyles() {
        // SELF
        this.style.height = '100%';
        this.style.borderWidth = '2px';
        this.style.borderStyle = 'solid';
        this.style.overflow = 'hidden';
        this.style.position = 'relative';

        // TITLE
        this.elements.name.style.position = 'absolute';
    }

    set player (player) {
        this.elements.name.textContent = player.name;
        this.elements.avatar.setAttribute('src',player.avatar);
        this.style.borderColor = player.color;
    }
}

customElements.define('ce-player', CePlayer);