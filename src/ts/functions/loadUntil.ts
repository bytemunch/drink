import addLoader from './addLoader.js';
import killLoader from './killLoader.js';

async function loadUntil(promise) {
    const t = performance.now().toString();
    addLoader(t);
    return promise.then(() => {
        killLoader(t);
    })
}

export default loadUntil;