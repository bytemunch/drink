/// <reference path='Page.ts'/>

class LoginPage extends Page {
    constructor() {
        super();

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
            loadMan.addLoader('pageOpen');
            firebase.auth().signInWithEmailAndPassword(emailInput.value, passInput.value)
                .catch(err => {
                    loadMan.killLoader('pageOpen');
                    console.error(err)
                    errorPopUp(err.code + ': ' + err.message);
                })
        })


        let btnSignup = document.createElement('button')
        btnSignup.textContent = 'Sign Up';

        btnSignup.addEventListener('click', e => {
            firebase.auth().createUserWithEmailAndPassword(emailInput.value, passInput.value)
                .catch(err => {
                    loadMan.killLoader('pageOpen');
                    console.error(err)
                    errorPopUp(err.code + ': ' + err.message);
                })
        })

        btnLogin.classList.add('big');
        btnSignup.classList.add('big', 'green');

        this.page.appendChild(emailP);
        this.page.appendChild(emailInput);
        this.page.appendChild(passP);
        this.page.appendChild(passInput);
        this.page.appendChild(btnLogin);
        this.page.appendChild(btnSignup);

    }
}