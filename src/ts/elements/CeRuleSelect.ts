import { palette } from "../index.js";

export default class CeRuleSelect extends HTMLSelectElement {

    availableRules;

    constructor() {
        super();
    }

    applyStyle() {
        this.style.backgroundColor = palette.blue;
        this.classList.add('big');
        this.style.width = '60%';
        this.id = 'rule-select';
    }

    connectedCallback() {
        //@ts-ignore
        this.targetGame = document.querySelector('#game-select').value;

        this.applyStyle();
    }

    update() {
        for (let x = this.length; x >= 0; x--) {
            this.remove(x);
        }

        for (let r of this.availableRules) {
            let o = document.createElement('option');
            o.text = r[0];
            o.value = r[1];

            this.add(o);
        }

        if (this.length == 0) {
            this.style.display = 'none';
        } else {
            this.style.display = 'block';
        }

    }

    set targetGame(game) {
        switch (game) {
            case 'ringoffire':
                this.availableRules = [
                    ['Default', 'default'],
                    ['More', 'default'],
                    ['Soon', 'default'],
                ]
                break;
            default:
                this.availableRules = []
                break;
        }

        this.update();
    }

}