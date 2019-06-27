/// <reference path='Page.ts'/>

class GameOverPage extends Page {
    constructor() {
        super();

        let topbar = document.createElement('ce-topbar')
        this.page.appendChild(topbar);

        let title = document.createElement('h1');

        title.textContent = `Game Over!`;

        this.page.appendChild(title);

        // Button to go back to home
        let home = document.createElement('button');

        home.addEventListener('click', e => {
            e.preventDefault();
            //window.location.href = '/index.html';
            //console.log('TODO refresh here?');
            openPage('home');
        })
        home.textContent = 'Home';
        home.classList.add('big');
        this.page.appendChild(home);

        // TODO play again / Reset lobby button?
    }
}