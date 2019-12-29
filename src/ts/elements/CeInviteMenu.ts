/// <reference path='CeMenu.ts'/>

class CeInviteMenu extends CeMenu {
    constructor() {
        super();
    }

    applyStyle() {
        super.applyStyle();
        this.logoutBtn.style.display = 'none';

    }

    connectedCallback() {
        super.connectedCallback();

        let title = document.createElement('h1');
        title.textContent = 'Invite';
        this.menu.appendChild(title);

        // Show room info
        let roomDisplay = document.createElement('p');
        roomDisplay.classList.add('roominfo');
        roomDisplay.textContent = `Room: ${GAME.roomId}`;
        this.menu.appendChild(roomDisplay);

        let pin = document.createElement('p');
        pin.style.cssFloat = 'right';
        pin.classList.add('roominfo');
        pin.textContent = `PIN: ${GAME.pin}`;
        this.menu.appendChild(pin);

        let desc = document.createElement('p');
        desc.textContent = 'Copy this link to invite your friends!';
        desc.style.width = '100%';
        this.menu.appendChild(desc);

        // copy-pasteable link here
        let link = document.createElement('input');
        link.classList.add('big');
        link.style.marginLeft = '1.5%';
        link.style.width = '80%';

        link.style.fontSize = 'larger';

        link.readOnly = true;
        link.value = GAME.link;

        link.addEventListener('click',e=>{
            link.select();
            document.execCommand('copy');
        })

        this.menu.appendChild(link);

        let copyButton = document.createElement('button');
        copyButton.style.backgroundImage = 'url(img/copy.svg)';
        copyButton.style.backgroundSize = 'contain';
        copyButton.style.width = '32px';
        copyButton.style.height = '32px';
        copyButton.style.cssFloat = 'right';
        copyButton.style.marginLeft = '5px';
        copyButton.addEventListener('click',e=>{
            link.select();
            document.execCommand('copy');
        })

        this.menu.appendChild(copyButton);

        // @ts-ignore share is available on mobile
        if (navigator.share) {
            link.style.width = '70%';

            let shareButton = document.createElement('button');
            shareButton.style.backgroundImage = 'url(img/share.svg)';
            shareButton.style.backgroundSize = 'contain';
            shareButton.style.width = '32px';
            shareButton.style.height = '32px';
            shareButton.style.cssFloat = 'right';
            shareButton.addEventListener('click', e=>{

                const shareObj = {
                    title: 'Drink!',
                    text: 'Come play a drinking game with me!',
                    url: GAME.link
                };

                // @ts-ignore
                navigator.share(shareObj);
            })
            this.menu.appendChild(shareButton);
        }
        this.applyStyle();
    }
}

customElements.define('ce-invite-menu', CeInviteMenu);