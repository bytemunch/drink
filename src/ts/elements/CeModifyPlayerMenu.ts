import CeMenu from "./CeMenu.js";
import CePlayerList from "./CePlayerList.js";
import { LOCAL_MODE } from "../index.js";
import Player from "../class/Player.js";
import CeAvatarUpload from "./CeAvatarUpload.js";

import {gameHandler} from '../index.js';
import { AnimButton } from "../types.js";
import { addAnimate } from "../functions/buttonAnimator.js";

export default class CeModifyPlayerMenu extends CeMenu {
    uid;
    constructor(uid) {
        super();
        this.uid = uid;
    }

    applyStyle() {
        super.applyStyle();
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.id="modify"+this.uid;

        this.h2title.textContent = 'Modify Player';

        let inputs: any = {
            name: {
                label: 'Display Name',
                type: 'text'
            },
            color: {
                label: 'Color',
                type: 'color'
            },
            avatar: {
                label: 'Profile Pic',
                type: 'file'
            }
        }

        for (let input in inputs) {
            let l = document.createElement('p');
            l.textContent = inputs[input].label;
            l.classList.add('big', 'label')
            this.menu.appendChild(l);

            let i;

            if (inputs[input].type == 'file') {
                i = new CeAvatarUpload(this.uid)//document.createElement('ce-avatar-upload');
            } else {
                i = document.createElement('input');
                i.setAttribute('type', inputs[input].type);
                i.classList.add('big');
                i.value = gameHandler.gameObject.players[this.uid][input];
            }

            i.setAttribute('id', `acc-input-${input}`);
            this.menu.appendChild(i);
            inputs[input] = i;
        }

        let btnUpdate = document.createElement('button');
        btnUpdate.textContent = 'Update Player';
        btnUpdate.classList.add('button-animate');
        btnUpdate.classList.add('big');

        btnUpdate.addEventListener('click', async e => {
            // await (<AnimButton>btnUpdate).baAnimate(e)

            // load here

            const playerInfo = {
                uid: this.uid,
                name: inputs['name'].value,
                color: inputs['color'].value,
            }

            if (!LOCAL_MODE) {
                gameHandler.gameObject.addPlayer(new Player(playerInfo));
                await inputs['avatar'].upload();
            }

            gameHandler.gameObject.players[this.uid] = playerInfo;

            (<CePlayerList>document.querySelector('ce-player-list')).update();

            // close modal
            this.hide()
        })

        this.menu.appendChild(btnUpdate);


        let btnRemove = document.createElement('button');
        btnRemove.classList.add('button-animate');
        btnRemove.textContent = 'Delete Player';
        btnRemove.classList.add('big', 'red');

        btnRemove.addEventListener('click', async (e) => {
            // await (<AnimButton>btnRemove).baAnimate(e)
            gameHandler.gameObject.removePlayer(this.uid);
            (<CePlayerList>document.querySelector('ce-player-list')).update();
            this.hide();
        })

        this.menu.appendChild(btnRemove);

        addAnimate(btnUpdate);
        addAnimate(btnRemove);

        this.applyStyle();
    }
}