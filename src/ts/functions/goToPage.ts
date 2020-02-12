import killLoader from './killLoader.js';
import { addAnimate } from './buttonAnimator.js';

export default function goToPage(page:string) {
    let app = document.querySelector('#app');

    if (app.querySelector('.page')) app.removeChild(app.querySelector('.page'));

    let pageElement = document.createElement(page);

    if (!app.querySelector('ce-header')) app.appendChild(document.createElement('ce-header'));

    app.appendChild(pageElement);

    app.querySelectorAll('.button-animate').forEach(elem=>{
        addAnimate(elem)
        console.log(elem);
    });
    app.querySelectorAll('button').forEach(elem=>addAnimate(elem));

    killLoader('pageOpen');
}