import CeLoadScreen from '../elements/CeLoadScreen.js';

export default function addLoader(killTrigger) {
    document.body.appendChild(new CeLoadScreen(killTrigger));
}