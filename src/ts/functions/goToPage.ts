function goToPage(page:string) {
    let app = document.querySelector('#app');

    if (app.querySelector('.page')) app.removeChild(app.querySelector('.page'));

    let pageElement = <CePage>document.createElement(page);

    if (!app.querySelector('ce-header')) app.appendChild(document.createElement('ce-header'));

    app.appendChild(pageElement);

    killLoader('pageOpen');
}