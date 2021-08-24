import CustomElement from "./CustomElement.js";
import CeAvatar from "./CeAvatar.js";

import { observer, userdata } from '../index.js';
import CeAccountMenu from "./CeAccountMenu.js";

export default class CePlayer extends CustomElement {
    uid;

    connectedOnce: boolean = false;

    constructor() {
        super();
    }

    async connectedCallback() {
        // FIRES EVERY DRAG!

        if (!this.connectedOnce) {
            await super.connectedCallback();

            this.draggable = true;

            this.addEventListener('click', async e => {
                if (this.uid !== userdata.uid) {
                    // const modifyMenu = document.querySelector('#modify' + this.uid) as unknown as CeModifyPlayerMenu;
                    // modifyMenu.show();
                    observer.send({channel: `open-modify-${this.uid}`});
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
        super.applyStyle();
    }

    set player(player) {
        this.HTMLReady.then(() => {
            let avatar = (<CeAvatar>this.shadowRoot.querySelector('ce-avatar'));
            avatar.uid = player.uid;

            this.uid = player.uid;

            this.shadowRoot.querySelector('.name').textContent = player.name;

            if (this.classList.contains('big')) {
                avatar.ready = player.ready;
                // add showhidebutton for player info
            }

            this.style.opacity = '1';

            this.style.borderColor = player.color;
        })
    }
}