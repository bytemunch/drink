import killLoader from './killLoader.js';
import { addAnimate } from './buttonAnimator.js';
import Page from '../pages/Page.js';
import { animMan } from '../index.js';

export default async function goToPage(page:string) {
    let app = document.querySelector('#app');

    let oldPage = app.querySelector('.page') as Page;

    if (oldPage) await animMan.animate(oldPage,'fadeOut',100,'easeIn')
    .then(()=>{app.removeChild(oldPage)});

    let pageElement = document.createElement(page);
    pageElement.style.opacity = '0';

    let header = app.querySelector('ce-header') as HTMLElement;
    if (!header) {
        header = document.createElement('ce-header');
        header.style.opacity = '0';
        app.appendChild(header);
        animMan.animate(header,'fadeIn',100,'easeIn')
        .then(()=>header.style.opacity = '1');
    }

    app.appendChild(pageElement);
    animMan.animate(pageElement,'fadeIn',100,'easeIn')
    .then(()=>pageElement.style.opacity = '1');

    app.querySelectorAll('.button-animate').forEach(elem=>{
        addAnimate(elem)
    });
    app.querySelectorAll('button').forEach(elem=>addAnimate(elem));

    killLoader('pageOpen');
}