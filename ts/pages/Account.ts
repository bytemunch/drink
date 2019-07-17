/// <reference path='Page.ts'/>

class AccountPage extends Page {
    constructor() {
        super();

        let topbar = document.createElement('ce-topbar')
        this.page.appendChild(topbar);

        let title = document.createElement('h1');

        title.textContent = `${userdata.name?userdata.name+'\'s':'Your'} account.`;
        title.style.marginTop = '2vh';

        this.page.appendChild(title);

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
            this.page.appendChild(l);

            let i;

            if (inputs[input].type == 'file') {
                i = document.createElement('ce-avatar-upload');
            } else {
                i = document.createElement('input');
                i.setAttribute('type',inputs[input].type);
                i.classList.add('big');
                i.value = userdata[input] || '';
            }

            i.setAttribute('id',`acc-input-${input}`);
            this.page.appendChild(i);

        }

        let btnUpdate = document.createElement('button');
        btnUpdate.textContent = 'Update';
        btnUpdate.classList.add('big');

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

        this.page.appendChild(btnUpdate);
    }
}