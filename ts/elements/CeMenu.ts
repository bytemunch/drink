/// <reference path='CustomElement.ts'/>

class CeMenu extends CustomElement {
    menu;
    logoutBtn;

    constructor() {
        super();
    }

    applyStyle() {
        this.style.backgroundColor = palette.greyAlpha;
        this.style.width = '100vw';
        this.style.height = '100vh';
        this.style.position = 'absolute';
        this.style.top = '0';
        this.style.left = '0';
        this.style.display = 'none';
        this.style.zIndex = '10';

        this.menu.style.backgroundColor = palette.green;
        this.menu.style.width = '90vw';
        this.menu.style.height = '90vh';
        this.menu.style.marginLeft = '5vw';
        this.menu.style.marginTop = '5vh';
        this.menu.style.position = 'absolute';
        this.menu.style.top = '0';
        this.menu.style.left = '0';
        this.menu.style.display = 'block';
        this.menu.style.zIndex = '10';
        this.menu.style.padding = '2vw';

        this.logoutBtn.classList.add('small', 'logout');
    }

    connectedCallback() {
        super.connectedCallback();
        this.menu = document.createElement('div');
        this.appendChild(this.menu);

        // add logout button
        this.logoutBtn = document.createElement('button');
        this.logoutBtn.textContent = 'Log Out';

        this.logoutBtn.addEventListener('click', e=>{
            console.log('TODO: Confirmation popup');
            firebase.auth().signOut();
        })

        this.menu.appendChild(this.logoutBtn);

        this.applyStyle();
    }

    addLeaveRoom() {
        
        // Leave room button
        let btnLeave = document.createElement('button');
        btnLeave.textContent = 'Leave Game';

        btnLeave.addEventListener('click', async e => {
            e.preventDefault();
            // POPUP HERE
            this.hide();
            addLoader('pageOpen');
            room.leave();
        })

        btnLeave.style.backgroundColor = palette.red;

        btnLeave.classList.add('big');

        this.menu.appendChild(btnLeave);
    }

    show() {
        this.style.display = 'block';
    }

    hide() {
        this.style.display = 'none';
    }

}