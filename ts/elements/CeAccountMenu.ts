/// <reference path='CeMenu.ts'/>

class CeAccountMenu extends CeMenu {
    constructor() {
        super();
    }

    applyStyle() {
        super.applyStyle();
    }

    connectedCallback() {
        super.connectedCallback();

        let inputs:any = {
            name: {label:'Display Name',
                   type: 'text'},
            color: {label:'Color',
                    type: 'color'},
            avatar:{label:'Profile Pic',
                    type: 'file'}
        }

        for (let input in inputs) {
            let l = document.createElement('p');
            l.textContent = inputs[input].label;
            l.classList.add('big','label')
            this.menu.appendChild(l);

            let i;

            if (inputs[input].type == 'file') {
                i = document.createElement('ce-avatar-upload');
            } else {
                i = document.createElement('input');
                i.setAttribute('type',inputs[input].type);
                i.classList.add('big');
                i.value = userdata[input] || '';
                if (input == 'name' && PROVIDER_VARS.name && !userdata.name) {
                    i.value = PROVIDER_VARS.name;
                }
            }

            i.setAttribute('id',`acc-input-${input}`);
            this.menu.appendChild(i);

        }

        let btnUpdate = document.createElement('button');
        btnUpdate.textContent = 'Update';
        btnUpdate.classList.add('big','bottom');

        btnUpdate.addEventListener('click', async e=>{
            // load here
            
            for (let input in inputs) {
                if (inputs[input].type == 'file') {
                    (<CeAvatarUpload>document.querySelector(`#acc-input-${input}`)).upload();
                } else {
                    userdata[input] = (<HTMLInputElement>document.querySelector(`#acc-input-${input}`)).value;
                }
            }

            if (userdata.name == '') {
                console.error('no name input');
                return;
            }
            
            await userdata.sendData();
            openPage('home');
        })

        this.menu.appendChild(btnUpdate);


        this.applyStyle();
    }
}

customElements.define('ce-account-menu', CeAccountMenu);