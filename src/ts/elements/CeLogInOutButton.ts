import { userSignedIn } from "../index.js";
import goToPage from "../functions/goToPage.js";
import CeMenu from "./CeMenu.js";
import firebase from '../functions/firebase.js';


export default class CeLogInOutButton extends HTMLButtonElement {
    baAnimate;
    
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('updateable-element','button-animate');
        this.classList.add('small', 'logout');

        this.addEventListener('click',e=>this.clicked(e));

        this.update();
    }

    async clicked(e) {
        // await this.baAnimate(e);
        if (userSignedIn()) {
            firebase.auth().signOut();
        } else {
            goToPage('pg-login');
        }
        (<CeMenu>this.parentElement.parentElement.parentElement).hide();
    }

    update() {
        this.textContent = userSignedIn() ? 'Log Out' : 'Log In';
    }
}