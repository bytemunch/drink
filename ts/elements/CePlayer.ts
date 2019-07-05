/// <reference path='CustomElement.ts'/>

interface ICePlayerElements {
    name: HTMLElement,
    avatar: CeAvatar,
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
            avatar: document.createElement('ce-avatar') as CeAvatar
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
        // const avatarLink = player.avatar?player.avatar:'/img/noimg.png';
        // this.elements.avatar.setAttribute('src', avatarLink);

        this.elements.avatar.uid = player.uid;

        this.elements.name.textContent = player.name;

        if (this.classList.contains('big')) this.elements.avatar.ready = player.ready;

        this.style.opacity = player.status == 'offline' ? '0.5' : '1';

        this.style.borderColor = player.color;
    }
}

customElements.define('ce-player', CePlayer);