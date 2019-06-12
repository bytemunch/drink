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
        // for later when shadow dom done
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