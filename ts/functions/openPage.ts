function openPage(name: string) {
    let page: Page;
    switch (name) {
        case 'login':
            page = new LoginPage();
            break;
        case 'home':
            page = new HomePage();
            break;
        case 'account':
            page = new AccountPage();
            break;
        case 'lobby':
            page = new LobbyPage();
            break;
        case 'play':
            page = new PlayPage();
            break;
        case 'finished':
            page = new GameOverPage();
            break;
        default:
            console.log(`Page ${name} not found!`);
            return;
    }
    let pageContainer = document.querySelector('#page');
    if (!pageContainer) {
        pageContainer = document.createElement('div');
        pageContainer.setAttribute('id', 'page');
        document.querySelector('#app').appendChild(pageContainer);
    }
    pageContainer.innerHTML = '';
    pageContainer.appendChild(page.page);
    loadMan.killLoader('pageOpen');
}
