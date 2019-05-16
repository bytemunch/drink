class Topbar {
    public html:HTMLElement;

    constructor() {
        this.html = document.createElement('div');

        this.html.classList.add('Topbar')

        let btnLogout = document.createElement('button');
        btnLogout.textContent = 'Log Out';

        btnLogout.addEventListener('click', e=>{
            firebase.auth().signOut();
        })

        this.html.appendChild(btnLogout);

        let accountLink = document.createElement('img');
        accountLink.classList.add('account-img');
        accountLink.setAttribute('src','yeet.png');

        accountLink.addEventListener('click',e=>{
            openPage('account');
        });

        this.html.appendChild(accountLink);
    }
}