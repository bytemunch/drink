async function loadUntil(promise) {
    const t = performance.now().toString();
    addLoader(t);
    return promise.then(() => {
        killLoader(t);
    })
}