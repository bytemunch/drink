/// <reference path='CustomElement.ts'/>
interface ICeLoadElements {
    title:HTMLElement,
    flavor:HTMLElement,
}

class CeLoadScreen extends CustomElement {
    elements:ICeLoadElements = {
        title: document.createElement('h2'),
        flavor: document.createElement('h3')
    }

    killTrigger:string;

    constructor() {
        super();
    }

    applyStyle() {
        this.style.width = '100vw';
        this.style.height = '100vh';
        this.style.position = 'absolute';
        this.style.backgroundColor = 'pink';
        this.style.display = 'block';
        this.style.top = '0';
        this.style.left = '0';
    }

    // show() {
    //     this.style.display = 'block';
    // }

    // hide() {
    //     this.style.display = 'none';
    // }

    kill() {
        this.parentElement.removeChild(this);
    }

    // async load(messages:Array<string>,waitFor:Function,params:Array<any>) {
    //     this.pickLoadMessage(messages);
    //     this.show();

    //     try {
    //         let result = await waitFor(params);
    //         if (!result) throw 'load: Failure.'
    //         this.hide();
    //         return result;
    //     } catch (e) {
    //         console.error(e);
    //         return setTimeout(()=>{
    //             return this.load(messages,waitFor,params);
    //         },500);
    //         console.log('oof');
    //     }
    // }

    pickLoadMessage(messages:Array<string>) {
        let rNum = Math.floor(Math.random()*messages.length);
        this.elements.flavor.textContent = messages[rNum];
    }

    connectedCallback() {
        super.connectedCallback();

        this.applyStyle();

        this.elements.title.textContent = 'loading';
        this.appendChild(this.elements.title);

        this.elements.flavor.textContent = 'won\'t be long...';
        this.appendChild(this.elements.flavor);
    }

}

customElements.define('ce-load-screen', CeLoadScreen);