/// <reference path='CustomElement.ts'/>

class CeInteractivePopUp extends CustomElement {
    titleP;
    messageP;
    innerDiv;
    options;
    val;

    constructor(title, message,  options) {
        super();

        this.options = [];

        this.innerDiv = document.createElement('div');
        this.titleP = document.createElement('p');
        this.messageP = document.createElement('p');

        this.titleP.textContent = title;
        this.messageP.textContent = message;

        this.innerDiv.appendChild(this.titleP);
        this.innerDiv.appendChild(this.messageP);

        this.val = new Promise(resolve=>{
            for (let o in options) {
                let idx = this.options.push(document.createElement('button'))-1;
                this.options[idx].classList.add('small');
                
                this.options[idx].addEventListener('click', e=>{
                    console.log('clicked:',o)
                    resolve(o);
                    this.kill();
                })
        
                this.options[idx].textContent = options[o];
    
                this.innerDiv.appendChild(this.options[idx]);
    
            }
        })

        this.appendChild(this.innerDiv);
    }

    connectedCallback() {
        this.classList.add('popup');
    }

    kill() {
        // animate then
        this.parentElement.removeChild(this);
    }
}

customElements.define('ce-interactive-popup', CeInteractivePopUp);