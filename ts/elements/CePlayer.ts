/// <reference path='CustomElement.ts'/>

interface ICePlayerElements {
    name: HTMLElement,
    ready: CePlayerReady,
    avatar: HTMLElement,
}

class CePlayer extends CustomElement {
    elements: ICePlayerElements;

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();

        this.elements = {
            name: document.createElement('h3'),
            ready: document.createElement('ce-player-ready') as CePlayerReady,
            avatar: document.createElement('img')
        };

        for (let e in this.elements) {
            this.elements[e].classList.add(e);
            this.appendChild(this.elements[e]);
        }

        this.applyStyles();
    }

    applyStyles() {
        // SELF
        // this.style.height = '100%';
        // this.style.borderWidth = '2px';
        // this.style.borderStyle = 'solid';
        // this.style.overflow = 'hidden';
        // this.style.position = 'relative';

        // TITLE
        // this.elements.name.style.position = 'absolute';
    }

    set player(player) {
        const avatarLink = player.avatar?player.avatar:'/img/noimg.png';
        this.elements.avatar.setAttribute('src', avatarLink);

        this.elements.name.textContent = player.name;

        this.elements.ready.ready = player.ready;

        this.style.borderColor = player.color;
    }
}

customElements.define('ce-player', CePlayer);