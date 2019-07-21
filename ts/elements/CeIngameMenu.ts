/// <reference path='CustomElement.ts'/>

class CeIngameMenu extends CustomElement {
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
    }

    connectedCallback() {
        super.connectedCallback();

        let menu = document.createElement('div');
        menu.style.backgroundColor = palette.green;
        menu.style.width = '90vw';
        menu.style.height = '90vh';
        menu.style.marginLeft = '5vw';
        menu.style.marginTop = '5vh';
        menu.style.position = 'absolute';
        menu.style.top = '0';
        menu.style.left = '0';
        menu.style.display = 'block';
        menu.style.zIndex = '10';
        menu.style.padding = '2vw';
        this.appendChild(menu);

        // Show room info
        let roomDisplay = document.createElement('p');
        roomDisplay.style.display = 'inline';
        roomDisplay.style.cssFloat = 'left';
        roomDisplay.style.paddingLeft = '3vw';

        roomDisplay.textContent = `Room: ${room.roomId}`;
        menu.appendChild(roomDisplay);

        let pin = document.createElement('p');
        pin.style.display = 'inline';
        pin.style.cssFloat = 'right';
        pin.style.paddingRight = '5vw';

        pin.textContent = `PIN: ${room.data.pin}`;
        menu.appendChild(pin);

        // Leave room button
        let btnLeave = document.createElement('button');
        btnLeave.textContent = 'Leave Room';

        btnLeave.addEventListener('click', async e => {
            e.preventDefault();
            // POPUP HERE
            this.hide();
            loadMan.addLoader('pageOpen');
            room.leave();
        })

        btnLeave.style.backgroundColor = palette.red;

        btnLeave.classList.add('big');

        menu.appendChild(btnLeave);

        this.applyStyle();
    }

    show() {
        this.style.display = 'block';
    }

    hide() {
        this.style.display = 'none';
    }

}

customElements.define('ce-ingame-menu', CeIngameMenu);