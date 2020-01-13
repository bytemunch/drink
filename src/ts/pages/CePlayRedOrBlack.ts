/// <reference path='CePage.ts'/>

class CePlayRedOrBlack extends CePage {

    constructor() {
        super();
        this.header = 'account';
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();
        // add elements to page

        let cardW = 70;

        let castGame = <RedOrBlack>GAME;

        // deck image
        let deckImg = document.createElement('img');
        deckImg.style.display = 'block';
        deckImg.style.position = 'absolute';
        deckImg.src = './img/cards/back.svg';
        deckImg.style.width = ((cardW / 320) * 100) + '%';
        deckImg.style.height = 'unset';
        deckImg.style.left = ((20 / 320) * 100) + '%';
        this.appendChild(deckImg);

        // deck image
        let discardImg = document.createElement('img');
        discardImg.classList.add('discard');
        discardImg.style.display = 'block';
        discardImg.style.position = 'absolute';
        discardImg.src = './img/cards/back.svg';
        discardImg.style.width = ((cardW / 320) * 100) + '%';
        discardImg.style.height = 'unset';
        discardImg.style.right = ((20 / 320) * 100) + '%';
        this.appendChild(discardImg);

        let controlGrid = document.createElement('div');
        controlGrid.style.display = 'grid';
        controlGrid.style.gridTemplateColumns = '1fr 1fr 1fr';
        controlGrid.style.gridTemplateRows = '1fr 1fr';
        controlGrid.style.gridGap = '20px';
        controlGrid.style.position = 'absolute';
        controlGrid.style.width = '80%';
        controlGrid.style.maxWidth = '80%';
        controlGrid.style.height = '120px';
        controlGrid.style.left = '10%';
        controlGrid.style.bottom = '10%';
        this.appendChild(controlGrid);

        const controls = {
            "RR": {
                txt: '2x Red',
                color: 'red'
            },
            "RRBB": {
                txt: '2x Purple',
                color: 'purple'
            },
            "BB": {
                txt: '2x Black',
                color: 'black'
            },
            "R": {
                txt: 'Red',
                color: 'red'
            },
            "RB": {
                txt: 'Purple',
                color: 'purple'
            },
            "B": {
                txt: 'Black',
                color: 'black'
            }
        }

        for (let bet in controls) {
            let c = document.createElement('div');
            c.style.backgroundColor = controls[bet].color;
            c.style.width = '100%';
            c.style.height = '100%';
            c.style.paddingTop = '25%';

            let p = document.createElement('p');
            p.textContent = controls[bet].txt;
            p.style.textAlign = 'center';
            c.appendChild(p);

            c.addEventListener('click', async () => {
                // Put previous cards away
                let discardBB = document.querySelector('.discard').getBoundingClientRect();
                for (let card of document.querySelectorAll('ce-card')) {
                    animMan.animate(card,'translateTo',500,{x:discardBB.x,y:discardBB.y});
                }



                castGame.placeBet(bet);
                let cards = castGame.takeTurn();
                // Animate card draw
                
                let idx = 0;
                for (let card of cards) {
                    let drawnCard = new CeCard;
                    drawnCard.style.display = 'block';
                    drawnCard.style.position = 'absolute';
                    drawnCard.style.width = ((cardW / 320) * 100) + '%';
                    drawnCard.style.height = 'unset';
                    drawnCard.style.left = ((20 / 320) * 100) + '%';                    
                    this.appendChild(drawnCard);

                    (<CeCard>drawnCard).backImg.style.visibility = 'hidden';


                    let bb = drawnCard.firstElementChild.getBoundingClientRect();

                    let offset = -1*((bb.width/4) * ((cards.length/2) - idx) - bb.width/8);

                    let tX = (window.innerWidth/2) - (bb.width/2) + offset;
                    let tY = (window.innerHeight/2) - (bb.height/2);

                    await animMan.animate(drawnCard,'translateTo',500,{x:tX,y:tY})
                    await drawnCard.drawCard(card);

                    idx++;
                }
                
                let win = castGame.checkWin(bet, cards);

                console.log(win, bet, cards, castGame.cardPot.length);

                if (!win) castGame.clearPot();
            })
            controlGrid.appendChild(c);
        }

        // Card display
        // let cardDisplay = new CeCard;
        // this.appendChild(cardDisplay);
    }
}

customElements.define('ce-play-red-or-black', CePlayRedOrBlack);