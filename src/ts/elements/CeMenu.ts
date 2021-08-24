import CustomElement from "./CustomElement.js";

import { animMan } from '../index.js';
import { addAnimate } from "../functions/buttonAnimator.js";

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

        this.menu = this.shadowRoot.querySelector('#menu');

        this.titlebar = this.shadowRoot.querySelector('#title');

        this.h2title = this.shadowRoot.querySelector('h2.menu-title');

        let closeDiv = this.shadowRoot.querySelector('#close');

        addAnimate(closeDiv);

        closeDiv.addEventListener('click', async (e) => {
            this.hide();
        });

        this.hide();

        this.applyStyle();
    }

    set title(t: string) {
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