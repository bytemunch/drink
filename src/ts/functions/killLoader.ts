function killLoader(killTrigger) {
    let _loaders = document.querySelectorAll('ce-load-screen') as NodeListOf<CeLoadScreen>;
    for (let l of _loaders) {
        if (l.killTrigger == killTrigger) l.kill();
    }
}