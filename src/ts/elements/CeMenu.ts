/// <reference path='CustomElement.ts'/>

// Abstract base menu class
class CeMenu extends CustomElement {
    menu;
    logoutBtn;
    openState;
    closeButton;

    constructor() {
        super();
        this.openState = 'false';
    }

    applyStyle() {
        this.menu.style.backgroundColor = palette.green;
        this.menu.style.width = `90%`;
        this.menu.style.height = `90%`;
        this.menu.style.marginTop = '5vh';
        this.menu.style.position = 'absolute';
        this.menu.style.top = '0';
        this.menu.style.left = `5%`;
        this.menu.style.display = 'block';
        this.menu.style.zIndex = '10';

        this.logoutBtn.classList.add('small', 'logout');

        this.style.backgroundColor = palette.greyAlpha;
        this.style.width = '100%';
        this.style.height = '100vh';
        this.style.position = 'absolute';
        this.style.top = '0';
        this.style.left = '0';
        this.style.display = this.openState ? 'block' : 'none';
        this.style.zIndex = '10';

        this.hide();
    }

    connectedCallback() {
        super.connectedCallback();

        this.menu = document.createElement('div');
        this.appendChild(this.menu);

        let title = document.createElement('h2');
        title.classList.add('menu-title');
        title.textContent = 'Menu Title';
        this.menu.appendChild(title);

        this.closeButton = document.createElement('img');
        this.closeButton.src = '/img/close-icon.svg';
        this.closeButton.style.position = 'relative';
        this.closeButton.style.float = 'right';
        this.closeButton.style.width = '32px';
        this.closeButton.style.height = '32px';
        this.closeButton.addEventListener('click', this.hide.bind(this));
        this.closeButton.style.backgroundColor = palette.red;
        this.menu.appendChild(this.closeButton);

        // add logout button
        this.logoutBtn = document.createElement('button');
        this.logoutBtn.style.float = 'left';

        if (typeof firebase !== "undefined") {
            if (firebase.auth().currentUser == null) {
                this.logoutBtn.textContent = 'Log In';

                this.logoutBtn.addEventListener('click', e => {
                    goToPage('ce-login');
                    this.hide();
                })
            } else {
                this.logoutBtn.textContent = 'Log Out';

                this.logoutBtn.addEventListener('click', e => {
                    firebase.auth().signOut();
                    this.hide();
                })
            }

            this.menu.appendChild(this.logoutBtn);
        }

        //TODO temp
        this.logoutBtn.textContent = 'Log In';
        this.menu.appendChild(this.logoutBtn);


        this.applyStyle();
    }

    set title(t:string) {
        let title = this.querySelector('h2');
        title.textContent = t;
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
        this.openState = true;
        this.style.display = 'block';
    }

    hide() {
        this.openState = false;
        this.style.display = 'none';
    }

}