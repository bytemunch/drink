import CeMenu from "./CeMenu.js";
import { LOCAL_MODE, observer } from "../index.js";
import Player from "../class/Player.js";
import CeAvatarUpload from "./CeAvatarUpload.js";

import {gameHandler} from '../index.js';
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

        this.title = 'Modify Player';

        let nameInput = this.shadowRoot.querySelector('#acc-input-name') as HTMLInputElement;
        let avatarInput = this.shadowRoot.querySelector('#acc-input-avatar') as CeAvatarUpload;
        let colorInput = this.shadowRoot.querySelector('#acc-input-color') as HTMLInputElement;

        nameInput.value = gameHandler.gameObject.players[this.uid].name;
        colorInput.value = gameHandler.gameObject.players[this.uid].color;

        let btnUpdate = this.shadowRoot.querySelector('#update');

        btnUpdate.addEventListener('click', async e => {
            // load here

            const playerInfo = {
                uid: this.uid,
                name: nameInput.value,
                color: colorInput.value,
            }

            if (!LOCAL_MODE) {
                gameHandler.gameObject.addPlayer(new Player(playerInfo));
                await avatarInput.upload();
            }

            gameHandler.gameObject.players[this.uid] = playerInfo;

            observer.send({channel:'ce-player-list'})

            // close modal
            this.hide()
        })

        let btnRemove = this.shadowRoot.querySelector('#remove');

        btnRemove.addEventListener('click', async (e) => {
            gameHandler.gameObject.removePlayer(this.uid);
            observer.send({channel:'ce-player-list'});
            this.hide();
        })

        addAnimate(btnUpdate);
        addAnimate(btnRemove);

        observer.watch(`open-modify-${this.uid}`, this.show.bind(this));

        this.applyStyle();
    }

    show() {
        super.show();
        console.log('show called!',this);
    }
}