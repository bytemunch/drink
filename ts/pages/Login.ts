/// <reference path='Page.ts'/>

class LoginPage extends Page {
    constructor() {
        super();

        let emailP = document.createElement('p');
        let passP = document.createElement('p');

        emailP.textContent = 'Email:';
        passP.textContent = 'Password:';

        let emailInput = document.createElement('input');
        let passInput = document.createElement('input');

        emailInput.setAttribute('type','email');
        passInput.setAttribute('type','password');

        let btnLogin = document.createElement('button')
        btnLogin.textContent = 'Login';

        btnLogin.addEventListener('click', e => {
            firebase.auth().signInWithEmailAndPassword(emailInput.value,passInput.value)
            .catch(err=>console.log(err))
            .then(user => {
                user ? ()=>{} : console.error('no such user');
            })
        })

        
        let btnSignup = document.createElement('button')
        btnSignup.textContent = 'Sign Up';

        btnSignup.addEventListener('click', e => {
            firebase.auth().createUserWithEmailAndPassword(emailInput.value,passInput.value)
            .catch(err=>console.log(err))
            .then(user=>{
                user ? ()=>{} : console.error('no such user');
            })
        })


        this.page.appendChild(emailP);
        this.page.appendChild(emailInput);
        this.page.appendChild(passP);
        this.page.appendChild(passInput);
        this.page.appendChild(btnLogin);
        this.page.appendChild(btnSignup);

    }
}