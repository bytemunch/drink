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

    async connectedCallback() {
        await super.connectedCallback();

        this.menu = document.createElement('div');
        this.menu.id = 'menu';
        this.shadowRoot.appendChild(this.menu);

        this.titlebar = document.createElement('div');
        this.titlebar.id = 'title'
        this.menu.appendChild(this.titlebar);

        this.h2title = document.createElement('h2');
        this.h2title.classList.add('menu-title');
        this.h2title.textContent = 'Menu Title';
        this.titlebar.appendChild(this.h2title);

        let closeDiv = document.createElement('button') as AnimButton;
        closeDiv.classList.add('button-animate');
        closeDiv.id = 'close';

        addAnimate(closeDiv);

        closeDiv.addEventListener('click', async (e) => {
            // await closeDiv.baAnimate(e);
            this.hide();
        } );

        this.titlebar.appendChild(closeDiv);

        this.hide();

        this.applyStyle();
    }

    set title(t:string) {
        let title = this.shadowRoot.querySelector('h2');
        title.textContent = t;
    }

    addLeaveRoom() {

        // Leave room button
        let btnLeave = document.createElement('button');
        btnLeave.classList.add('btn-leave', 'big');
        btnLeave.textContent = 'Leave Game';

        btnLeave.addEventListener('click', async e => {
            e.preventDefault();
            // POPUP HERE
            this.hide();
        })

        this.menu.appendChild(btnLeave);
    }

    show() {
        this.openState = true;

        // TODO use animation fill to do this style setting?
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