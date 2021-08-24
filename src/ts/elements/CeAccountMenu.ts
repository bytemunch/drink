import CeMenu from "./CeMenu.js";
import { LOCAL_MODE, userSignedIn, userdata, observer } from "../index.js";
import goToPage from "../functions/goToPage.js";
import CeAvatarUpload from "./CeAvatarUpload.js";

import {PROVIDER_VARS} from '../index.js';
import {gameHandler} from '../index.js';
import { addAnimate } from "../functions/buttonAnimator.js";
import firebase from "../functions/firebase.js";

export default class CeAccountMenu extends CeMenu {
    constructor() {
        super();
    }

    async connectedCallback() {
        await super.connectedCallback();

        // add logout button

        if (!LOCAL_MODE) {
            this.logoutBtn = this.shadowRoot.querySelector('#login');
            this.logoutBtn.textContent = userSignedIn() ? 'Log Out' : 'Log In';
            this.logoutBtn.addEventListener('click', e=>{
                if (userSignedIn()) {
                    firebase.auth().signOut();
                } else {
                    goToPage('pg-login');
                }
                this.hide();
            })
        }

        this.title = 'Account';

        (<HTMLInputElement>this.shadowRoot.querySelector('#acc-input-name')).value = userdata.name || PROVIDER_VARS.name || '';
        (<HTMLInputElement>this.shadowRoot.querySelector('#acc-input-color')).value = userdata.color || '#FF00FF';

        let btnUpdate = this.shadowRoot.querySelector('#update');

        btnUpdate.addEventListener('click', async (e) => {
            let asyncPromises = [];
            // load here
            if ((<HTMLInputElement>this.shadowRoot.querySelector(`#acc-input-name`)).value == '') {
                console.error('no name input');
                return;
            }

            asyncPromises.push((<CeAvatarUpload>this.shadowRoot.querySelector(`#acc-input-avatar`)).upload());
            userdata.name = (<HTMLInputElement>this.shadowRoot.querySelector(`#acc-input-name`)).value;
            userdata.color = (<HTMLInputElement>this.shadowRoot.querySelector(`#acc-input-color`)).value;

            if (userSignedIn()) asyncPromises.push(userdata.sendData());

            await (Promise.all(asyncPromises));

            this.hide();
            observer.send({channel:'ce-account-button'});
        });

        let backButton = this.shadowRoot.querySelector('#home');

        backButton.addEventListener('click',  async (e) => {
            console.log('Back button pressed!');
            if (gameHandler.gameObject) gameHandler.gameObject.leave();
            goToPage('pg-home');
            this.hide();
        });

        addAnimate(btnUpdate);
        addAnimate(backButton);
    }

    update() {
        this.removeChild(this.menu);
        // TODO don't recall connectedCallback
        this.connectedCallback();
    }
}