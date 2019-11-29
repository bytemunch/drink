class CeRuleSelectDiv extends CustomElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // this.attachShadow({mode:'open'});
        this.appendChild(new CeRuleSelect);

        let ruleCreateMenu = new CeRuleCreateMenu;

        this.appendChild(ruleCreateMenu);

        let showCardMenu = new CeShowButton(ruleCreateMenu);

        showCardMenu.style.position = 'relative'
        showCardMenu.style.cssFloat = 'right'
        showCardMenu.style.left = '5px'
        showCardMenu.openImg = './img/add.svg'

        this.appendChild(showCardMenu);

        this.style.display = 'flex';
        this.style.width = '100%';
    }
}

customElements.define('ce-rule-select-div', CeRuleSelectDiv)