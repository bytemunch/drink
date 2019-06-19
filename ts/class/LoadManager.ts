class LoadManager {
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
        let loadersToRemove = [];
        for (let l of this.loaders) {
            if (killTrigger == l.killTrigger) {
                l.kill();
                loadersToRemove.push(l)
            }
        }

        for (let killMe of loadersToRemove) {
            this.loaders.splice(this.loaders.indexOf(killMe),1);
        }
    }
}