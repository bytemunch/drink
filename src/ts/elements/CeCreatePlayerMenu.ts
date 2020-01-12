/// <reference path='CeMenu.ts'/>

class CeCreatePlayerMenu extends CeMenu {
    constructor() {
        super();
    }

    applyStyle() {
        super.applyStyle();
    }

    connectedCallback() {
        super.connectedCallback();

        this.h2title.textContent = 'Add Player';

        let newUid = `${userdata.uid}-${userdata.extraPlayerCount}`;

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
                i = new CeAvatarUpload(newUid)//document.createElement('ce-avatar-upload');
            } else {
                i = document.createElement('input');
                i.setAttribute('type', inputs[input].type);
                i.classList.add('big');
            }

            if (input == 'name') {
                i.value = 'Player ' + (userdata.extraPlayerCount + 2);
            }

            i.setAttribute('id', `acc-input-${input}`);
            this.menu.appendChild(i);
            inputs[input] = i;
        }

        let btnUpdate = document.createElement('button');
        btnUpdate.textContent = 'Add Player';
        btnUpdate.classList.add('big');

        btnUpdate.addEventListener('click', async e => {
            // load here
            if (inputs.name.value == '') {
                console.error('no name input');
                errorPopUp('Please enter a name!');
                return;
            }

            const playerInfo = new Player({
                uid: newUid,
                name: inputs['name'].value,
                color: inputs['color'].value,
            });

            if (!LOCAL_MODE) inputs['avatar'].upload();
            GAME.addPlayer(playerInfo);

            // add player modify menu to page
            document.querySelector('.page').appendChild(new CeModifyPlayerMenu(newUid))

            // Uhhhh reset modal? or something idk why i'm doin shit so backwards ahhahaa
            userdata.extraPlayerCount++;
            newUid = `${userdata.uid}-${userdata.extraPlayerCount}`;
            inputs.name.value = 'Player ' + (userdata.extraPlayerCount + 2);
            inputs.avatar.uid = newUid;

            (<CePlayerList>document.querySelector('ce-player-list')).update();

            // close modal
            this.hide();
        })

        this.menu.appendChild(btnUpdate);

        this.applyStyle();
    }
}

customElements.define('ce-create-player-menu', CeCreatePlayerMenu);