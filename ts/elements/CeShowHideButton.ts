/// <reference path='CustomElement.ts'/>

class CeShowHideButton extends CustomElement {
    openState = false;
    target;
    icon;

    constructor(target) {
        super();
        this.target = target;
    }

    applyStyle() {
        this.style.backgroundColor = palette.blue;
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

        this.icon = document.createElement('img');
        this.icon.setAttribute('src','./img/menu-icon.svg');
        this.icon.classList.add('icon');
        this.appendChild(this.icon);

        this.addEventListener('click', this.clicked);

        this.applyStyle();
    }

    clicked() {
        this.openState = !this.openState;
        if (this.openState) {
            this.target.show();
            this.style.backgroundColor = palette.red;
            this.icon.setAttribute('src','./img/close-icon.svg');

        }else{
            this.target.hide();
            this.style.backgroundColor = palette.blue;
            this.icon.setAttribute('src','./img/menu-icon.svg');
        }
    }

}

customElements.define('ce-show-hide-button', CeShowHideButton);