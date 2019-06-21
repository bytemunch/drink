/// <reference path='UpdateableElement.ts'/>

class CeTopbar extends CustomElement {
    constructor() {
        super();


    }

    hide() {
        this.style.display = 'none';
    }

    show() {
        this.style.display = 'block';
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();

        this.classList.add('topbar')

        let btnLogout = document.createElement('button');
        btnLogout.textContent = 'Log Out';

        btnLogout.addEventListener('click', e=>{
            firebase.auth().signOut();
        })

        btnLogout.classList.add('small', 'logout');

        this.appendChild(btnLogout);

        // TODO only show this when logged in
        // tbf there's a lot more to do before this shite haha
        let accountLink = document.createElement('ce-avatar') as CeAvatar;

        accountLink.uid = userdata.uid;
        
        accountLink.addEventListener('click',e=>{
            openPage('account');
        });

        this.appendChild(accountLink);

        this.applyStyle();

    }

}

customElements.define('ce-topbar', CeTopbar);