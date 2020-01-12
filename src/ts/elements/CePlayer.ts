/// <reference path='CustomElement.ts'/>

interface ICePlayerElements {
    name: HTMLElement,
    avatar: CeAvatar,
}

class CePlayer extends CustomElement {
    elements: ICePlayerElements;
    uid;

    connectedOnce:boolean = false;

    constructor(uid) {
        super();
        this.uid = uid;
    }

    connectedCallback() {
        // FIRES EVERY DRAG!

        if (!this.connectedOnce) {
            super.connectedCallback();

            this.draggable = true;
    
            this.elements = {
                name: document.createElement('h3'),
                avatar: document.createElement('ce-avatar') as CeAvatar
            };
    
            for (let e in this.elements) {
                this.elements[e].classList.add(e);
                this.appendChild(this.elements[e]);
            }
    
            this.addEventListener('click', e => {
                if (this.uid !== userdata.uid) {
                    const modifyMenu = document.querySelector('#modify' + this.uid) as CeModifyPlayerMenu;
                    modifyMenu.show();
                }
    
            })
    
            this.applyStyle();
        }

        this.connectedOnce = true;

    }

    applyStyle() {
        // for drag drop
        this.classList.add('dd-item');
    }

    set player(player) {
        // const avatarLink = player.avatar?player.avatar:'/img/noimg.png';
        // this.elements.avatar.setAttribute('src', avatarLink);

        this.elements.avatar.uid = player.uid;

        this.uid = player.uid;

        this.elements.name.textContent = player.name;

        if (this.classList.contains('big')) {
            this.elements.avatar.ready = player.ready;
            // add showhidebutton for player info
        }

        this.style.opacity = '1';//player.status == 'offline' ? '0.5' : '1';

        this.style.borderColor = player.color;
    }
}

customElements.define('ce-player', CePlayer);