import CeMenu from "./CeMenu.js";

import { LOCAL_MODE, observer } from "../index.js";
import Player from "../class/Player.js";
import CeModifyPlayerMenu from "./CeModifyPlayerMenu.js";
import errorPopUp from "../functions/errorPopUp.js";
import CeAvatarUpload from "./CeAvatarUpload.js";

import { userdata } from '../index.js';
import { gameHandler } from '../index.js';

export default class CeCreatePlayerMenu extends CeMenu {
    constructor() {
        super();
    }

    applyStyle() {
        super.applyStyle();
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.title = 'Add Player';

        let newUid = `${userdata.uid}-${userdata.extraPlayerCount}`;
        let nameInput = this.shadowRoot.querySelector('#acc-input-name') as HTMLInputElement;
        let avatarInput = this.shadowRoot.querySelector('#acc-input-avatar') as CeAvatarUpload;
        let colorInput = this.shadowRoot.querySelector('#acc-input-color') as HTMLInputElement;

        nameInput.value = 'Player ' + (userdata.extraPlayerCount + 2);

        let btnUpdate = this.shadowRoot.querySelector('#update');

        btnUpdate.addEventListener('click', async (e) => {
            // load here
            if (nameInput.value == '') {
                console.error('no name input');
                errorPopUp('Please enter a name!');
                return;
            }

            const playerInfo = new Player({
                uid: newUid,
                name: nameInput.value,
                color: colorInput.value,
            });

            if (!LOCAL_MODE) await avatarInput.upload();
            gameHandler.gameObject.addPlayer(playerInfo);

            // add player modify menu to page
            document.querySelector('.page').shadowRoot.appendChild(new CeModifyPlayerMenu(newUid));

            // Uhhhh reset modal? or something idk why i'm doin shit so backwards ahhahaa
            userdata.extraPlayerCount++;
            newUid = `${userdata.uid}-${userdata.extraPlayerCount}`;
            nameInput.value = 'Player ' + (userdata.extraPlayerCount + 2);
            avatarInput.uid = newUid;

            // update playerlist
            observer.send({ channel: 'ce-player-list' });

            // close modal
            this.hide();
        })

        this.menu.appendChild(btnUpdate);

        this.applyStyle();
    }
}