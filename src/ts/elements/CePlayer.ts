import CustomElement from "./CustomElement.js";
import CeModifyPlayerMenu from "./CeModifyPlayerMenu.js";
import CeAvatar from "./CeAvatar.js";

import {userdata} from '../index.js';
import CeAccountMenu from "./CeAccountMenu.js";

interface ICePlayerElements {
    name: HTMLElement,
    avatar: CeAvatar,
}

export default class CePlayer extends CustomElement {
    elements: ICePlayerElements;
    uid;
    baAnimate;

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
                avatar: document.createElement('ce-avatar') as unknown as CeAvatar
            };
    
            for (let e in this.elements) {
                this.elements[e].classList.add(e);
                this.shadowRoot.appendChild(this.elements[e]);
            }
    
            this.addEventListener('click', async e => {
                await this.baAnimate(e);
                if (this.uid !== userdata.uid) {
                    const modifyMenu = document.querySelector('#modify' + this.uid) as unknown as CeModifyPlayerMenu;
                    modifyMenu.show();
                } else {
                    console.log('opening account menu');
                    (<CeAccountMenu>document.querySelector('ce-account-menu')).show();
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
        this.elements.avatar.uid = player.uid;

        this.uid = player.uid;

        this.elements.name.textContent = player.name;

        if (this.classList.contains('big')) {
            this.elements.avatar.ready = player.ready;
            // add showhidebutton for player info
        }

        this.style.opacity = '1';

        this.style.borderColor = player.color;
    }
}