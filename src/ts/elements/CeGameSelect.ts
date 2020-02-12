import { palette } from "../index.js";
import CeRuleSelect from "./CeRuleSelect.js";


export default class CeGameSelect extends HTMLSelectElement {

    constructor() {
        super();
    }

    applyStyle() {
        this.style.backgroundColor = palette.blue;
        this.classList.add('big');
        this.id = 'game-select';
    }

    connectedCallback() {

        // get available games
        // from server?

        const games = [
            ['Ring of Fire', 'ringoffire'],
            ['More', 'ringoffire'],
            ['games', 'ringoffire'],
            ['coming', 'ringoffire'],
            ['soon!', 'testgame'],
        ]

        let o:HTMLOptionElement;

        for (let g of games) {
            o = document.createElement('option');
            o.text = g[0];
            o.value = g[1];

            this.add(o);
        }

        this.addEventListener('change', e=>{
            let ruleSel = document.querySelector('#rule-select') as CeRuleSelect;
            ruleSel.targetGame = this.value;
        })

        this.applyStyle();
    }

}