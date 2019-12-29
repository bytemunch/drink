class CeLogInOutButton extends HTMLButtonElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('updateable-element');
        this.classList.add('small', 'logout');
        //@ts-ignore
        this.style.cssFloat = 'left';

        this.addEventListener('click',this.clicked);

        this.update();
    }

    clicked() {
        if (userSignedIn()) {
            firebase.auth().signOut();
        } else {
            goToPage('ce-login');
        }
        (<CeMenu>this.parentElement.parentElement.parentElement).hide();
    }

    update() {
        this.textContent = userSignedIn() ? 'Log Out' : 'Log In';
    }
}

customElements.define('ce-log-in-out-button',CeLogInOutButton,{extends:'button'})