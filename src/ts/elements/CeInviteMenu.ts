import CeMenu from "./CeMenu.js";

import {gameHandler} from '../index.js';


export default class CeInviteMenu extends CeMenu {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();

        let title = document.createElement('h1');
        title.textContent = 'Invite';
        this.menu.appendChild(title);

        // Show room info
        let roomDisplay = document.createElement('p');
        roomDisplay.classList.add('roominfo');
        roomDisplay.textContent = `Room: ${gameHandler.gameObject.roomId}`;
        this.menu.appendChild(roomDisplay);

        let pin = document.createElement('p');
        pin.classList.add('roominfo', 'pin');
        pin.textContent = `PIN: ${gameHandler.gameObject.pin}`;
        this.menu.appendChild(pin);

        let desc = document.createElement('p');
        desc.textContent = 'Copy this link to invite your friends!';
        desc.classList.add('desc');
        this.menu.appendChild(desc);

        // copy-pasteable link here
        let link = document.createElement('input');
        link.classList.add('big');

        link.readOnly = true;
        link.value = gameHandler.gameObject.link;

        link.addEventListener('click',e=>{
            link.select();
            document.execCommand('copy');
        })

        this.menu.appendChild(link);

        let copyButton = document.createElement('button');
        copyButton.classList.add('copy');

        copyButton.addEventListener('click',e=>{
            link.select();
            document.execCommand('copy');
        })

        this.menu.appendChild(copyButton);

        // @ts-ignore share is available on mobile
        if (navigator.share) {
            link.style.width = '70%';

            let shareButton = document.createElement('button');
            shareButton.classList.add('share');

            shareButton.addEventListener('click', e=>{

                const shareObj = {
                    title: 'Drink!',
                    text: 'Come play a drinking game with me!',
                    url: gameHandler.gameObject.link
                };

                // @ts-ignore
                navigator.share(shareObj);
            })
            this.menu.appendChild(shareButton);
        }
        this.applyStyle();
    }
}