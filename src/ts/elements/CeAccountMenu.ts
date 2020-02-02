import CeMenu from "./CeMenu.js";
import { LOCAL_MODE, userSignedIn, userdata } from "../index.js";
import updateDOM from "../functions/updateDOM.js";
import goToPage from "../functions/goToPage.js";
import CeAvatarUpload from "./CeAvatarUpload.js";
import CeLogInOutButton from "./CeLogInOutButton.js";

import {PROVIDER_VARS} from '../index.js';
import {gameHandler} from '../index.js';
export default class CeAccountMenu extends CeMenu {
    constructor() {
        super();
    }

    applyStyle() {
        super.applyStyle();
        this.classList.add('updateable-element');
    }

    connectedCallback() {
        super.connectedCallback();

        // add logout button

        if (!LOCAL_MODE) {
            this.logoutBtn = new CeLogInOutButton;
            this.titlebar.appendChild(this.logoutBtn);
        }

        this.title = 'Account';

        let inputs: any = {
            name: {
                label: 'Display Name',
                type: 'text'
            },
            color: {
                label: 'Color',
                type: 'color'
            },
            avatar: {
                label: 'Profile Pic',
                type: 'file'
            }
        }

        for (let input in inputs) {
            let l = document.createElement('p');
            l.textContent = inputs[input].label;
            l.classList.add('big', 'label')
            this.menu.appendChild(l);

            let i;

            if (inputs[input].type == 'file') {
                i = document.createElement('ce-avatar-upload');
            } else {
                i = document.createElement('input');
                i.setAttribute('type', inputs[input].type);
                i.classList.add('big');
                i.value = userdata[input] || '';
                if (input == 'name' && PROVIDER_VARS.name && !userdata.name) {
                    i.value = PROVIDER_VARS.name;
                }
            }

            i.setAttribute('id', `acc-input-${input}`);
            this.menu.appendChild(i);

        }

        let btnUpdate = document.createElement('button');
        btnUpdate.textContent = 'Update';
        btnUpdate.classList.add('big');

        btnUpdate.addEventListener('click', async e => {
            // load here
            if ((<HTMLInputElement>document.querySelector(`#acc-input-name`)).value == '') {
                console.error('no name input');
                return;
            }

            for (let input in inputs) {
                if (inputs[input].type == 'file' && !LOCAL_MODE) {
                    (<CeAvatarUpload>document.querySelector(`#acc-input-${input}`)).upload();
                } else {
                    userdata[input] = (<HTMLInputElement>document.querySelector(`#acc-input-${input}`)).value;
                }
            }

            if (userSignedIn()) await userdata.sendData();

            updateDOM();

            this.hide();
        })

        this.menu.appendChild(btnUpdate);

        let backButton = document.createElement('button');
        backButton.textContent = 'Back to Home';

        backButton.addEventListener('click', e => {
            console.log('Back button pressed!');
            if (gameHandler.gameObject) gameHandler.gameObject.leave();
            goToPage('pg-home');
            this.hide();
        });

        backButton.classList.add('big', 'red', 'bottom');

        this.menu.appendChild(backButton);

        this.applyStyle();
    }

    update() {
        this.removeChild(this.menu);
        this.connectedCallback();
    }
}

// customElements.define('ce-account-menu', CeAccountMenu);