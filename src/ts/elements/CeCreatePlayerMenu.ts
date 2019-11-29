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

        this.logoutBtn.style.display = 'none';

        let title = document.createElement('h1');
        title.textContent = 'Add Local Player';
        this.menu.appendChild(title);

        let newUid = userdata.uid + userdata.extraPlayerCount;

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
                // i.value = userdata[input] || '';
            }

            if (input == 'name') {
                i.value = userdata.name + ' ' + (userdata.extraPlayerCount + 1);
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
            if (userdata.name == '') {
                console.error('no name input');
                errorPopUp('Please enter a name!');
                return;
            }

            const playerInfo = {
                uid: newUid,
                name: inputs['name'].value,
                color: inputs['color'].value,
            }

            inputs['avatar'].upload();

            await room.addLocalPlayer(playerInfo);

            // add player modify menu to page
            document.querySelector('#pageInner').appendChild(new CeModifyPlayerMenu(newUid))

            userdata.extraPlayerCount++;
            newUid = userdata.uid + userdata.extraPlayerCount;
            inputs.name.value = userdata.name + ' ' + (userdata.extraPlayerCount + 1);
            inputs.avatar.uid = newUid;

            // close modal
            this.hide();
        })

        this.menu.appendChild(btnUpdate);


        this.applyStyle();
    }
}

customElements.define('ce-create-player-menu', CeCreatePlayerMenu);