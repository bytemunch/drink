/// <reference path='CustomElement.ts'/>

interface ICePlayerElements {
    name:HTMLElement,
    ready:HTMLElement,
    avatar:HTMLElement,
}

class CePlayer extends CustomElement {
    elements:ICePlayerElements = {
        name : document.createElement('h3'),
        ready : document.createElement('img'),
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
    }

    set player (player) {
        this.elements.name.textContent = player.name;
        this.elements.avatar.setAttribute('src',player.avatar);
        this.style.backgroundColor = player.color;
    }
}

customElements.define('ce-player', CePlayer);