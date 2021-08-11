import CustomElement from "./CustomElement.js";

import {palette, animMan} from '../index.js';
import { addAnimate } from "../functions/buttonAnimator.js";
import { AnimButton } from "../types.js";

// Abstract base menu class
export default class CeMenu extends CustomElement {
    menu;
    titlebar;
    logoutBtn;
    openState;
    h2title;

    constructor() {
        super();
        this.openState = 'false';
    }

    applyStyle() {
        super.applyStyle();
        
        this.menu.style.backgroundColor = palette.green;
        this.menu.style.width = `90%`;
        this.menu.style.height = `90%`;
        this.menu.style.marginTop = '5vh';
        this.menu.style.position = 'absolute';
        this.menu.style.top = '0';
        this.menu.style.left = `5%`;
        this.menu.style.display = 'block';
        this.menu.style.zIndex = '10';

        this.titlebar.style.width = '100%';
        this.titlebar.style.height = '32px';

        this.style.backgroundColor = palette.greyAlpha;
        this.style.width = '100%';
        this.style.height = '100vh';
        this.style.position = 'absolute';
        this.style.top = '0';
        this.style.left = '0';
        this.style.display = this.openState ? 'block' : 'none';
        this.style.zIndex = '10';

        this.hide();
    }

    connectedCallback() {
        super.connectedCallback();

        this.menu = document.createElement('div');
        this.shadowRoot.appendChild(this.menu);

        this.titlebar = document.createElement('div');
        this.menu.appendChild(this.titlebar);

        this.h2title = document.createElement('h2');
        this.h2title.classList.add('menu-title');
        this.h2title.textContent = 'Menu Title';
        this.titlebar.appendChild(this.h2title);

        let closeDiv = document.createElement('button') as AnimButton;
        closeDiv.classList.add('button-animate');
        addAnimate(closeDiv);
        closeDiv.style.position = 'absolute';
        closeDiv.style.top = '0';
        closeDiv.style.right = '0';
        closeDiv.style.backgroundColor = palette.red;
        closeDiv.style.backgroundImage = 'url(./img/close-icon.svg)';
        closeDiv.style.backgroundSize= 'contain';
        closeDiv.style.float = 'right';
        closeDiv.style.width = '32px';
        closeDiv.style.height = '32px';
        closeDiv.addEventListener('click', async (e) => {
            await closeDiv.baAnimate(e);
            this.hide();
        } );

        this.titlebar.appendChild(closeDiv);

        this.applyStyle();
    }

    set title(t:string) {
        let title = this.shadowRoot.querySelector('h2');
        title.textContent = t;
    }

    addLeaveRoom() {

        // Leave room button
        let btnLeave = document.createElement('button');
        btnLeave.textContent = 'Leave Game';

        btnLeave.addEventListener('click', async e => {
            e.preventDefault();
            // POPUP HERE
            this.hide();
        })

        btnLeave.style.backgroundColor = palette.red;

        btnLeave.classList.add('big');

        this.menu.appendChild(btnLeave);
    }

    show() {
        this.openState = true;
        this.style.opacity = '0';
        this.style.display = 'block';
        animMan.animate(this, 'fadeIn', 100, 'easeOut');
    }

    async hide() {
        this.openState = false;
        await animMan.animate(this, 'fadeOut', 100, 'easeOut')
        this.style.display = 'none';
    }

}