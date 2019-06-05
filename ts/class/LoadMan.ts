class LoadMan {
    loaders:Array<CeLoadScreen> = [];

    constructor() {

    }

    addLoader(killTrigger:string) {
        let newLoader = document.createElement('ce-load-screen') as CeLoadScreen;
        newLoader.killTrigger = killTrigger;
        this.loaders.push(newLoader);
        document.body.appendChild(newLoader);
    }

    killLoader(killTrigger) {
        for (let l of this.loaders) {
            if (killTrigger == l.killTrigger) {
                l.kill();
            }
        }
    }


}