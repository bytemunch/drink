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

        // up next
        let upNext = new CeNextPlayerCenter;
        this.appendChild(upNext);

        // deck image
        let discardImg = document.createElement('img');
        discardImg.classList.add('discard');
        discardImg.style.display = 'block';
        discardImg.style.position = 'absolute';
        discardImg.src = './img/cards/back.svg';
        discardImg.style.width = ((cardW / 320) * 100) + '%';
        discardImg.style.height = 'unset';
        discardImg.style.right = ((20 / 320) * 100) + '%';
        discardImg.style.opacity = '0.4';
        this.appendChild(discardImg);

        let dBB = discardImg.getBoundingClientRect();

        let potCount = new CePotCounter;

        const size = dBB.width * 0.9;

        potCount.style.left = (dBB.left + (dBB.width - size) / 2) + 'px';
        potCount.style.width = size + 'px';
        potCount.style.height = size + 'px';
        potCount.style.marginTop = '6%';
        this.appendChild(potCount);

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
            let c = document.createElement('button');
            c.classList.add(controls[bet].color, 'bet-button')
            c.style.width = '100%';
            c.style.height = '100%';

            let p = document.createElement('p');
            p.textContent = controls[bet].txt;
            p.style.textAlign = 'center';
            c.appendChild(p);

            c.addEventListener('click', async e => {
                // disable all buttons
                for (let b of document.querySelectorAll('.bet-button')) {
                    let button = <HTMLButtonElement>b;
                    let savedColor;
                    if (button == e.target) savedColor = getComputedStyle(button).backgroundColor;
                    button.disabled = true;
                    if (button == e.target) button.style.backgroundColor = savedColor;
                }

                castGame.placeBet(bet);
                let cards = await castGame.takeTurn();
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

                    let offset = -1 * ((bb.width / 4) * ((cards.length / 2) - idx) - bb.width / 8);

                    let tX = (window.innerWidth / 2) - (bb.width / 2) + offset;
                    let tY = (window.innerHeight / 2) - (bb.height / 2);

                    await animMan.animate(drawnCard, 'translateTo', 250, 'easeOutQuad', { x: tX, y: tY })
                    await drawnCard.drawCard(card);

                    idx++;
                }

                let win = castGame.checkWin(bet, cards);

                // On loss, popup loser name + amount of drinks
                // Put previous cards away
                let discardBB = document.querySelector('.discard').getBoundingClientRect();
                for (let card of document.querySelectorAll('ce-card')) {
                    animMan.animate(card, 'translateTo', 500, 'easeInOutQuint', { x: discardBB.x, y: discardBB.y })
                        .then(() => { potCount.update(); upNext.update(); })
                }

                if (!win) {

                    let drinkPopUp = new CePopUp('FUNNY TITLE HERE',
                        `${GAME.players[GAME.previousPlayer].name}, drink ${castGame.cardPot.length}!`,
                        0,
                        'info');

                    drinkPopUp.style.zIndex = '100';

                    document.body.appendChild(drinkPopUp);
                    // show all cards to drink for

                    // remove spent cards

                    castGame.clearPot();
                    potCount.update();
                }

                // if no cards left
                if (castGame.deck.cards.length <= 0) {
                    let maybeText = () => {
                        if (castGame.cardPot.length) {
                            return `Everyone drink ${castGame.cardPot.length}!`
                        } else {
                            return '';
                        }
                    }

                    let gameOverText = `No cards left! ${maybeText()}`;

                    let gameOverPopUp = new CePopUp('Game Over!',
                        gameOverText,
                        0,
                        'info',
                        goToPage,
                        'ce-home-page'
                    )

                    document.body.appendChild(gameOverPopUp);
                }

                // reenable buttons
                for (let b of document.querySelectorAll('.bet-button')) {
                    let button = <HTMLButtonElement>b;
                    button.disabled = false;
                    if (button == e.target) button.style.backgroundColor = '';
                }
            })
            controlGrid.appendChild(c);
        }

        // Card display
        // let cardDisplay = new CeCard;
        // this.appendChild(cardDisplay);
    }
}

customElements.define('ce-play-red-or-black', CePlayRedOrBlack);