import { userSignedIn } from "../index.js";
import goToPage from "../functions/goToPage.js";
import CeMenu from "./CeMenu.js";
import firebase from '../functions/firebase.js';


export default class CeLogInOutButton extends HTMLButtonElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('updateable-element');
        this.classList.add('small', 'logout');
        this.style.cssFloat = 'left';

        this.addEventListener('click',this.clicked);

        this.update();
    }

    clicked() {
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