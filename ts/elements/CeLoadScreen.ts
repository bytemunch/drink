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
    timer;
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
        this.style.zIndex = '100';
    }

    dots() {
        let currentText = this.elements.title.textContent;
        let matches = currentText.match(/[\.]/g);

        if (matches && matches.length>=3) {
            currentText = currentText.replace(/[\.]/g,'');
        } else {
            currentText = currentText + '.';
        }
        this.elements.title.textContent = currentText;
    }

    kill() {
        clearInterval(this.timer);
        this.parentElement.removeChild(this);
    }

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

        this.timer = setInterval(this.dots.bind(this),500);
    }

}

customElements.define('ce-load-screen', CeLoadScreen);