/// <reference path='Page.ts'/>

class AccountPage extends Page {
    constructor() {
        super();

        let title = document.createElement('h1');

        title.textContent = `${userdata.name?userdata.name+'\'s':'Your'} account.`;

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
            this.page.appendChild(l);
            let i:HTMLInputElement = document.createElement('input');
            i.setAttribute('id',`acc-input-${input}`);
            i.setAttribute('type',inputs[input].type);

            i.value = userdata[input] || null;
            this.page.appendChild(i);
        }

        let btnUpdate = document.createElement('button');
        btnUpdate.textContent = 'Update';

        btnUpdate.addEventListener('click', e=>{

            for (let input in inputs) {
                userdata[input] = (<HTMLInputElement>document.querySelector(`#acc-input-${input}`)).value;
            }

            if (userdata.name == '') {
                console.error('no name input');
                return false;
            }
            
            userdata.sendData()
            .then(()=>openPage('home'),e=>console.error);
        })

        this.page.appendChild(btnUpdate);
    }
}