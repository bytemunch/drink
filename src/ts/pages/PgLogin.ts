import firebase from '../functions/firebase.js';
import { palette } from "../index.js";
import goToPage from "../functions/goToPage.js";
import errorPopUp from "../functions/errorPopUp.js";
import Page from "./Page.js";

export default class PgLogin extends Page {
    constructor() {
        super();
        this.header = 'account';
    }

    applyStyle() {

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
        emailLabel.classList.add('big','label');
        emailLabel.textContent = 'Email:';

        this.appendChild(emailLabel);
        this.appendChild(emailInput);

        // Password

        let passwordInput = document.createElement('input');
        passwordInput.id = 'pin-input';
        passwordInput.classList.add('big');
        passwordInput.type = 'password';
        let passwordLabel = document.createElement('p');
        passwordLabel.classList.add('big','label');
        passwordLabel.textContent = 'Password:';

        this.appendChild(passwordLabel);
        this.appendChild(passwordInput);

        let loginButton = document.createElement('button');
        loginButton.textContent = 'Login';

        loginButton.addEventListener('click', e => {
            console.log('Login button pressed!');
            firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value)
                .catch(err => {
                    console.error(err)
                    errorPopUp(err.code + ': ' + err.message);
                })
        });

        loginButton.classList.add('big');

        this.appendChild(loginButton);

        // Signup

        let signupButton = document.createElement('button');
        signupButton.textContent = 'Sign Up';

        signupButton.addEventListener('click', e => {
            // confirm password?

            firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
                .catch(err => {
                    console.error(err)
                    errorPopUp(err.code + ': ' + err.message);
                })
        })

        signupButton.classList.add('big','green');

        // Facebook

        this.appendChild(signupButton);

        let facebookButton = document.createElement('button');
        facebookButton.textContent = 'Continue with Facebook';

        facebookButton.style.backgroundColor = palette.facebook;

        facebookButton.addEventListener('click', e=>{
            // facebook login
            let fbProvider = new firebase.auth.FacebookAuthProvider;
            firebase.auth().signInWithRedirect(fbProvider);
        })

        facebookButton.classList.add('big');

        this.appendChild(facebookButton);

        // Back

        let backButton = document.createElement('button');
        backButton.textContent = 'Back';

        backButton.addEventListener('click', e => {
            console.log('Back button pressed!');
            goToPage('pg-home');
        });

        backButton.classList.add('big','red');

        this.appendChild(backButton);
    }
}