import firebase from '../functions/firebase.js';
import { palette } from "../index.js";
import goToPage from "../functions/goToPage.js";
import errorPopUp from "../functions/errorPopUp.js";
import Page from "./Page.js";
import { AnimButton } from '../types.js';
import disablePage from '../functions/disablePage.js';

export default class PgLogin extends Page {
    constructor() {
        super();
        this.header = 'account';
    }

    connectedCallback() {
        super.connectedCallback();

        // add elements to page

        // Email

        let emailInput = document.createElement('input');
        emailInput.id = 'room-input';
        emailInput.classList.add('big');
        emailInput.type = 'email';
        let emailLabel = document.createElement('p');
        emailLabel.classList.add('big', 'label');
        emailLabel.textContent = 'Email:';

        this.shadowRoot.appendChild(emailLabel);
        this.shadowRoot.appendChild(emailInput);

        // Password

        let passwordInput = document.createElement('input');
        passwordInput.id = 'pin-input';
        passwordInput.classList.add('big');
        passwordInput.type = 'password';
        let passwordLabel = document.createElement('p');
        passwordLabel.classList.add('big', 'label');
        passwordLabel.textContent = 'Password:';

        this.shadowRoot.appendChild(passwordLabel);
        this.shadowRoot.appendChild(passwordInput);

        let loginButton = document.createElement('button');
        loginButton.textContent = 'Login';

        loginButton.addEventListener('click', async function (e) {
            console.log('Login button pressed!');
            // await (<AnimButton>loginButton).baAnimate(e)
            firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value)
                .catch(err => {
                    console.error(err)
                    errorPopUp(err.code + ': ' + err.message);
                })
        });

        loginButton.classList.add('big');

        this.shadowRoot.appendChild(loginButton);

        // Signup

        let signupButton = document.createElement('button');
        signupButton.textContent = 'Sign Up';

        signupButton.addEventListener('click', async function (e) {
            disablePage();
            // await (<AnimButton>this).baAnimate(e)
            // confirm password?
            firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
                .catch(err => {
                    console.error(err)
                    errorPopUp(err.code + ': ' + err.message);
                })
        })

        signupButton.classList.add('big', 'green');

        // Facebook

        this.shadowRoot.appendChild(signupButton);

        let facebookButton = document.createElement('button');
        facebookButton.textContent = 'Continue with Facebook';

        facebookButton.style.backgroundColor = palette.facebook;

        facebookButton.addEventListener('click', async function (e) {
            disablePage();
            // await (<AnimButton>this).baAnimate(e)
            // facebook login
            let fbProvider = new firebase.auth.FacebookAuthProvider;
            firebase.auth().signInWithRedirect(fbProvider);
        })

        facebookButton.classList.add('big');

        this.shadowRoot.appendChild(facebookButton);

        // Back

        let backButton = document.createElement('button');
        backButton.textContent = 'Back';

        backButton.addEventListener('click', async function (e) {
            disablePage();
            // await (<AnimButton>this).baAnimate(e)
            console.log('Back button pressed!');
            goToPage('pg-home');
        });

        backButton.classList.add('big', 'red');

        this.shadowRoot.appendChild(backButton);
    }
}