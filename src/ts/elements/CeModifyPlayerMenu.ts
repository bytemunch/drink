/// <reference path='CeMenu.ts'/>

class CeModifyPlayerMenu extends CeMenu {
    uid;
    constructor(uid) {
        super();
        this.uid = uid;
    }

    applyStyle() {
        super.applyStyle();
    }

    connectedCallback() {
        super.connectedCallback();

        this.id="modify"+this.uid;

        this.logoutBtn.style.display = 'none';

        let title = document.createElement('h1');
        title.textContent = 'Edit Local Player';
        this.menu.appendChild(title);

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
                i.value = GAME.players[this.uid][input];
            }

            i.setAttribute('id', `acc-input-${input}`);
            this.menu.appendChild(i);
            inputs[input] = i;
        }

        let btnUpdate = document.createElement('button');
        btnUpdate.textContent = 'Update Player';
        btnUpdate.classList.add('big');

        btnUpdate.addEventListener('click', async e => {
            // load here

            const playerInfo = {
                uid: this.uid,
                name: inputs['name'].value,
                color: inputs['color'].value,
            }

            if (!LOCAL_MODE) {
                room.addLocalPlayer(playerInfo);
                inputs['avatar'].upload();
            }

            GAME.players[this.uid] = playerInfo;

            (<CePlayerList>document.querySelector('ce-player-list')).update();

            // close modal
            this.hide()
        })

        this.menu.appendChild(btnUpdate);


        let btnRemove = document.createElement('button');
        btnRemove.textContent = 'Delete Player';
        btnRemove.classList.add('big', 'red');

        btnRemove.addEventListener('click', async e => {
            GAME.removePlayer(this.uid);
            (<CePlayerList>document.querySelector('ce-player-list')).update();
            this.hide();
        })

        this.menu.appendChild(btnRemove);


        this.applyStyle();
    }
}

customElements.define('ce-modify-player-menu', CeModifyPlayerMenu);