import firebase from '../functions/firebase.js';
import goToPage from "../functions/goToPage.js";
import errorPopUp from "../functions/errorPopUp.js";
import Page from "./Page.js";
import disablePage from '../functions/disablePage.js';

export default class PgLogin extends Page {
    constructor() {
        super();
        this.header = 'account';
    }

    async connectedCallback() {
        await super.connectedCallback();

        let emailInput = this.shadowRoot.querySelector('#email-input') as HTMLInputElement;
        let passwordInput = this.shadowRoot.querySelector('#password-input') as HTMLInputElement;

        let loginButton = this.shadowRoot.querySelector('#login-button');

        loginButton.addEventListener('click', async function (e) {
            console.log('Login button pressed!');
            firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value)
                .catch(err => {
                    console.error(err)
                    errorPopUp(err.code + ': ' + err.message);
                })
        });


        let signupButton = this.shadowRoot.querySelector('#signup-button');

        signupButton.addEventListener('click', async function (e) {
            disablePage();
            // confirm password?
            firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
                .catch(err => {
                    console.error(err)
                    errorPopUp(err.code + ': ' + err.message);
                })
        })

        let facebookButton = this.shadowRoot.querySelector('#facebook-button');

        facebookButton.addEventListener('click', async function (e) {
            disablePage();
            // facebook login
            let fbProvider = new firebase.auth.FacebookAuthProvider;
            firebase.auth().signInWithRedirect(fbProvider);
        })

        let backButton = this.shadowRoot.querySelector('#back-button');

        backButton.addEventListener('click', async function (e) {
            disablePage();
            console.log('Back button pressed!');
            goToPage('pg-home');
        });
    }
}