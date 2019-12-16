/// <reference path='Page.ts'/>

class LoginPage extends Page {
    constructor() {
        super();

        this.addLogo();

        let emailP = document.createElement('p');
        let passP = document.createElement('p');

        emailP.textContent = 'Email:';
        passP.textContent = 'Password:';
        emailP.classList.add('label', 'big')
        passP.classList.add('label', 'big')
        let emailInput = document.createElement('input');
        let passInput = document.createElement('input');

        emailInput.setAttribute('type', 'email');
        emailInput.classList.add('big');
        passInput.setAttribute('type', 'password');
        passInput.classList.add('big');


        let btnLogin = document.createElement('button')
        btnLogin.textContent = 'Login';

        btnLogin.addEventListener('click', e => {
            addLoader('pageOpen');
            firebase.auth().signInWithEmailAndPassword(emailInput.value, passInput.value)
                .catch(err => {
                    killLoader('pageOpen');
                    console.error(err)
                    errorPopUp(err.code + ': ' + err.message);
                })
        })
        btnLogin.classList.add('big');


        let btnFb = document.createElement('button');
        btnFb.textContent = 'Continue with Facebook';

        btnFb.style.backgroundColor = palette.facebook;

        btnFb.addEventListener('click', e=>{
            // facebook login
            let fbProvider = new firebase.auth.FacebookAuthProvider;
            firebase.auth().signInWithRedirect(fbProvider);
        })

        btnFb.classList.add('big');

        let btnSignup = document.createElement('button')
        btnSignup.textContent = 'Sign Up';

        btnSignup.addEventListener('click', e => {
            firebase.auth().createUserWithEmailAndPassword(emailInput.value, passInput.value)
                .catch(err => {
                    killLoader('pageOpen');
                    console.error(err)
                    errorPopUp(err.code + ': ' + err.message);
                })
        })

        btnSignup.classList.add('big', 'green');

        this.page.appendChild(emailP);
        this.page.appendChild(emailInput);
        this.page.appendChild(passP);
        this.page.appendChild(passInput);
        this.page.appendChild(btnLogin);
        this.page.appendChild(btnSignup);

        this.page.appendChild(btnFb);
    }
}