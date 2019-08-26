function openPage(name: string, pushHistory = true) {
    let page: Page;

    let state = null;

    if (pushHistory) history.pushState(state, 'Drink!' + name, `${location.origin}/#${name}`);

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
            if (room.data.state == 'playing') {
                openPage('play');
                return;
            }
            // set hash location and search
            if (pushHistory) history.replaceState(state, 'Drink! - Lobby', `/?r=${room.roomId}&p=${room.data.pin}#lobby`);
            page = new LobbyPage();
            break;
        case 'play':
                if (pushHistory) history.replaceState(state, 'Drink! - Play', `/?r=${room.roomId}&p=${room.data.pin}#play`);
            page = new PlayPage();
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

    AJAX_NAV.prev = name;

    killLoader('pageOpen');
}
