/// <reference path='CustomElement.ts'/>

class CeShowHideButton extends CustomElement {
    openState = false;
    target;

    constructor(target) {
        super();
        this.target = target;
    }

    applyStyle() {
        this.style.backgroundColor = palette.green;
        this.style.width = '32px';
        this.style.height = '32px';
        this.style.display = 'block';
        this.style.position = 'absolute';
        this.style.right = '1vw';
        this.style.top = '1vw';
        
        this.style.zIndex = '11';
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('click', this.clicked);

        this.applyStyle();
    }

    clicked() {
        this.openState = !this.openState;
        if (this.openState) {
            this.target.show();
            this.style.backgroundColor = palette.red;

        }else{
            this.target.hide();
            this.style.backgroundColor = palette.green;

        }
    }

}

customElements.define('ce-show-hide-button', CeShowHideButton);