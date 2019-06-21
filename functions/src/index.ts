// TODO classes and interfaces as module

interface ICard {
    suit: string,
    number: string
}

class Deck {
    public cards: Array<ICard> = [];
    constructor(private jokercount: number = 2) {
        const numbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "JK"];
        const suits = ["clubs", "diamonds", "hearts", "spades"];

        for (let n of numbers) {
            if (n != "JK") {
                for (let s of suits) {
                    this.cards.push({ suit: s, number: n });
                }
            } else {
                for (let i = 0; i < this.jokercount; i++) {
                    this.cards.push({ suit: 'joker', number: i.toString() });
                }
            }
        }
    }
}

interface IAction {
    type: string,
    trigger: string,
    target: string
}

class RuleSet {
    public rules: Object;
    public winState: Object;
    constructor(ruleset) {
        this.rules = {};
        switch (ruleset) {
            case 'IRL':
            default:
                this.setupIRL();
        }
    }

    addRule(card: string, title: string, desc: string, action: IAction) {
        this.rules[card] = { title, desc, action };
    }

    createAction(type: string, trigger: string, target: string) {
        return { type, trigger, target };
    }

    setupIRL() {
        this.addRule('A', 'Waterfall', 'desc', this.createAction('IRL', 'Immediate', 'All'));
        this.addRule('2', 'Choose', 'desc', this.createAction('Target', 'Immediate', 'Choose'));
        this.addRule('3', 'Me', 'desc', this.createAction('Target', 'Immediate', 'Self'));
        this.addRule('4', 'Whores', 'desc', this.createAction('Target', 'Immediate', 'Females'));
        this.addRule('5', 'Thumb Master', 'desc', this.createAction('IRL', 'User', 'Choose'));
        this.addRule('6', 'Dicks', 'desc', this.createAction('Target', 'Immediate', 'Males'));
        this.addRule('7', 'Heaven', 'desc', this.createAction('IRL', 'User', 'Choose'));
        this.addRule('8', 'Mate', 'desc', this.createAction('Target', 'Immediate', 'Mate'));
        this.addRule('9', 'Bust a Rhyme', 'desc', this.createAction('IRL', 'Immediate', 'Vote'));
        this.addRule('10', 'Categories', 'desc', this.createAction('IRL', 'Immediate', 'Vote'));
        this.addRule('J', 'Make a Rule', 'desc', this.createAction('IRL', 'User', 'Choose'));
        this.addRule('Q', 'Question Master', 'desc', this.createAction('IRL', 'User', 'Choose'));
        this.addRule('K', 'Pour', 'desc', this.createAction('IRL', 'Immediate', 'Self'));
        this.addRule('JK', 'Travolta', 'desc', this.createAction('IRL', 'User', 'Choose'));

        this.winState = { if: 'LAST_KING', then: { action: this.createAction('IRL', 'Immediate', 'Self'), desc: 'Down the middle cup!' } }
    }
}

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const cors = require('cors')({ origin: true });

const firestore = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const joinRoom = functions.https.onRequest((req, res) => {
    //TODO async await this shit up
    cors(req, res, () => {
        const data = JSON.parse(req.body);
        const roomRef = firestore.collection('rooms').doc(data.roomId)

        admin.auth().verifyIdToken(data.token)
            .then(userToken => {
                roomRef.get()
                    .then(snap => {
                        const doc = snap.data();

                        if (!userToken.uid) return Promise.reject('joinRoom: User not provided!');

                        if (!snap.exists) {
                            return Promise.reject({ err: 'joinRoom: Room not found!', code: '404' }); // not found
                        }

                        // if (doc.state !== 'lobby') {
                        //     // send state in error message
                        //     return Promise.reject({ err: `joinRoom: Room not ready. State: <${doc.state}>`, code: '425', state: doc.state }); // too early
                        // }


                        if (doc.state == 'preparing') {
                            // send state in error message
                            return Promise.reject({ err: `joinRoom: Room not ready. State: <${doc.state}>`, code: '425', state: doc.state }); // too early
                        }

                        if (!doc.pin) {
                            // TODO this error code?
                            return Promise.reject({ err: 'joinRoom: Room has no pin!', code: '425' });// too early
                        }

                        if (data.pin == "OWNER" && userToken.uid == doc.owner) {
                            return Promise.resolve();
                        }

                        if (doc.pin == data.pin) {
                            return Promise.resolve();
                        }

                        return Promise.reject({ err: 'joinRoom: Incorret PIN!', code: '403' }); //forbidden
                    })
                    .then(() => {
                        return firestore.collection('users').doc(userToken.uid).get();
                    })
                    .then(userdata => {
                        // add player to room
                        // TODO maybe split this out?
                        return firestore.runTransaction(async t => {
                            return t.get(roomRef)
                                .then(async roomDoc => {
                                    if (!roomDoc.exists) {
                                        return Promise.reject({ err: 'joinRoom: Room doesn\'t exist!', code: '500' }) // unknown server error
                                    }

                                    // let newPlayerRef = roomRef.collection('players').doc(userToken.uid);

                                    // let newPlayerData = userdata.data();

                                    // newPlayerData.ready = false;
                                    // newPlayerData.hand = {};

                                    // delete newPlayerData.currentRoom;
                                    // delete newPlayerData.status;// maybe keep this?
                                    // // no point; removed if offline

                                    // await newPlayerRef.set(newPlayerData);
                                    // return Promise.resolve();


                                    let players = roomDoc.data().players;

                                    if (!players[userToken.uid]) {

                                        // make a copy and not just use a ref because
                                        // we are authed here. yay security
                                        players[userToken.uid] = userdata.data();

                                        // trim stuff
                                        delete players[userToken.uid].currentRoom;
                                        delete players[userToken.uid].status;


                                        players[userToken.uid].ready = false;
                                        players[userToken.uid].hand = {};

                                        t.update(roomRef, { players: players });
                                        t.update(roomRef, { turnOrder: admin.firestore.FieldValue.arrayUnion(userToken.uid) })
                                        userdata.ref.set({ currentRoom: roomRef }, { merge: true })
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject({ err: 'joinRoom: Player already in room!', code: '409' }) // conflict
                                    }

                                })
                        })
                    })
                    .then(() => res.send({ joined: true, roomId: data.roomId }))
                    .catch(error => res.send({ error, joined: false }))
            })
            .catch(error => res.send({ error, joined: false }))

    });
})

export const createRoom = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        // Create room request, takes user, responds success or failure
        const data = JSON.parse(req.body);

        async function getRoomId(len: number = 4) {
            const roomsinfo = await firestore.collection('rooms').doc('roomsinfo').get()
                .then(doc => {
                    if (doc.exists) {
                        return doc.data();
                    } else {
                        return doc.ref.set({ roomcount: 0 })
                            .then((e) => { return e })
                    }
                })

            function createId(len) {
                let str = '';
                for (let i = 0; i < len; i++) {
                    str = str + String.fromCharCode(Math.ceil((Math.random()) * 26) + 64);
                }
                // return 'test';
                return str;
            }

            let newRoomId = createId(len);
            let breakCounter = 0;

            while ((roomsinfo.roomlist[newRoomId] != undefined) && (roomsinfo.roomlist[newRoomId] != false) && (breakCounter < 26 ** len)) {
                newRoomId = createId(len);
                breakCounter++;
            }

            if (breakCounter >= 26 ** len) {
                //randomness has failed us!
                // TODO sequentially check for available rooms here
                return Promise.reject('Room slots full!')
            }

            return newRoomId;
        }


        admin.auth().verifyIdToken(data.token)
            .then(token => {
                getRoomId(4)
                    .then(roomId => {
                        const roomDocRef = firestore.collection('rooms').doc(roomId);
                        return firestore.runTransaction(t => {
                            return t.get(roomDocRef)
                                .then(roomDoc => {
                                    if (!roomDoc.exists) {
                                        t.set(roomDocRef, {
                                            owner: token.uid,//TODO refrence here?
                                            state: 'preparing',
                                            timestamp: {
                                                created: admin.firestore.FieldValue.serverTimestamp(),
                                                modified: admin.firestore.FieldValue.serverTimestamp()
                                            }
                                        }, { merge: true })
                                        return Promise.resolve({ roomId });
                                    } else {
                                        return Promise.reject('createRoom: Room already exists!');
                                    }
                                })
                        })
                    })

                    .then(result => {
                        res.send({ roomId: result.roomId, result });
                    })
                    .catch(err => {
                        console.log(err);
                        res.send({ roomId: false, err });
                    });
            })
    })
})

// TODO on room update: change modified timestamp
// REMEMBER TO NOT MAKE AN INFINITE LOOP HERE SAM!!!!!!!!

// on new room created
// populate room with owner, deck, rules
export const roomCreated = functions.firestore
    .document('rooms/{roomId}')
    .onCreate(async (snap, ctx) => {
        const roomId = ctx.params.roomId;

        function createPin(len) {
            let pin: string = '';
            for (let i = 0; i < len; i++) {
                pin = pin + Math.floor(Math.random() * 10).toString();
            }
            return pin;
        }

        // TODO check if creating user already owns a room, if so
        // > IF ROOM IN PLAY CANCEL CREATION ?
        // > ELSE DELETE OTHER ROOM AND CONTINUE

        if (roomId !== 'roomsinfo') {
            const deck = new Deck();
            const rules = new RuleSet('IRL');
            const pin = createPin(4);
            const infoRef = snap.ref.parent.doc('roomsinfo');

            // Add to roomlist
            infoRef.set({ roomlist: { [roomId]: true } }, { merge: true });

            await firestore.runTransaction(t => {
                return t.get(infoRef).then(infoDoc => {
                    if (!infoDoc.exists) {
                        return Promise.reject("No roomsinfo!");
                    }

                    // let newCount = infoDoc.data().roomcount + 1;
                    t.update(infoRef, { roomcount: admin.firestore.FieldValue.increment(1) })
                    return Promise.resolve();
                })
            })
                .catch(e => console.error);

            snap.ref.set({
                deck: deck.cards,
                rules: rules.rules,
                winState: rules.winState,
                currentCard: {},
                pin: pin,
                players: {},
                turnOrder: [],
                state: 'lobby',
                turnCounter: 0
            }, { merge: true })
                .then(() => { console.log('Added deck, rules, currentCard, pin, turnOrder.') }, e => console.error)
        }
    });

export const roomDeleted = functions.firestore
    .document('rooms/{roomId}')
    .onDelete(async (snap, ctx) => {
        const roomId = ctx.params.roomId;

        if (roomId !== 'roomsinfo') {
            const infoRef = snap.ref.parent.doc('roomsinfo');

            infoRef.set({ roomlist: { [roomId]: false } }, { merge: true });

            firestore.runTransaction(t => {
                return t.get(infoRef).then(infoDoc => {
                    if (!infoDoc.exists) {
                        throw "No roomsinfo!";
                    }

                    // let newCount = infoDoc.data().roomcount - 1;
                    t.update(infoRef, { roomcount: admin.firestore.FieldValue.increment(-1) });
                })
            })
                .catch(e => console.error);
        }
    });

export const startGame = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const data = JSON.parse(req.body);
        // Auth user == owner
        admin.auth().verifyIdToken(data.token)
            .then(token => {
                firestore.collection('rooms').doc(data.roomId).get()
                    .then(doc => {
                        const room = doc.data();
                        if (token.uid != room.owner) {
                            Promise.reject({ err: 'User does not own room!', code: '403' })//forbidden
                        }

                        // Set room state to playing
                        doc.ref.set({ state: 'playing' }, { merge: true })
                            .then(result => {
                                res.send({ info: 'Room set up!', code: '200' })//OK
                            })

                    })
            })

            .catch(e => {
                res.send(e);
            })
    })
})

function checkWin(room) {
    const winState = room.winState;

    switch (winState.if) {
        case 'LAST_KING':
        default:
            if (!room.deck.find(c => { return c.number == 'K' })) return winState.then;
    }

    return false;
}

export const drawCard = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const data = JSON.parse(req.body);

        admin.auth().verifyIdToken(data.token)
            .then(token => {
                firestore.collection('rooms').doc(data.roomId).get()
                    .then(doc => {
                        const room = doc.data();
                        if (token.uid != room.turnOrder[room.turnCounter]) {
                            return Promise.reject({ err: 'Not your turn!', code: '403' })//forbidden
                        }

                        let newTurnCount = 0;
                        // Reset turn counter to 0

                        // IF turn counter is less than turnOrder.length
                        if (room.turnCounter < room.turnOrder.length - 1) {
                            // Increment turn counter
                            newTurnCount = room.turnCounter + 1;
                        } // else leave at 0

                        // Pick card
                        let newCards = room.deck;
                        const cardsInDeck = room.deck.length;

                        const selectedCardNumber = Math.floor(Math.random() * cardsInDeck)
                        const selectedCard = room.deck[selectedCardNumber];
                        newCards.splice(selectedCardNumber, 1)

                        let newDataToMerge = {
                            // Set current card
                            currentCard: selectedCard,
                            // Remove current card from deck in room
                            deck: newCards,
                            // set turn counter
                            turnCounter: newTurnCount,
                            state: room.state,
                            rules: room.rules
                        }

                        const gameOver = checkWin(room);

                        if (gameOver) {
                            // set room  state
                            newDataToMerge.currentCard.action = gameOver.action;
                            newDataToMerge.state = 'finished';

                            // REFAC dont like this
                            newDataToMerge.rules[selectedCard.number].desc = gameOver.desc;
                        }

                        return doc.ref.set(newDataToMerge, { merge: true })
                            .then(result => {
                                if (gameOver) doc.ref.delete();
                                return res.send({ info: 'Turn Taken', code: '200', result });
                            })
                    })
                    .catch(e => {
                        console.error(e);
                        res.send(e);
                    })
            })
    })
})

export const userStateChange = functions.database.ref('/status/{uid}')
    .onUpdate(async (change, context) => {
        // ctrl+c ctrl+z | i am 1337 c0d3r yo
        // Get the data written to Realtime Database
        const eventStatus = change.after.val();

        // Then use other event data to create a reference to the
        // corresponding Firestore document.
        const userStatusFirestoreRef = firestore.doc(`status/${context.params.uid}`);

        // It is likely that the Realtime Database change that triggered
        // this event has already been overwritten by a fast change in
        // online / offline status, so we'll re-read the current data
        // and compare the timestamps.
        const statusSnapshot = await change.after.ref.once('value');
        const status = statusSnapshot.val();
        console.log(status, eventStatus);
        // If the current timestamp for this data is newer than
        // the data that triggered this event, we exit this function.
        if (status.last_changed > eventStatus.last_changed) {
            return null;
        }

        // Otherwise, we convert the last_changed field to a Date
        eventStatus.last_changed = new Date(eventStatus.last_changed);

        // ... and write it to Firestore.
        userStatusFirestoreRef.set(eventStatus);

        // Then check if user was in a room
        const userRef = firestore.doc(`users/${context.params.uid}`);

        userRef.get().then(async doc => {
            const data = await doc.data();

            const room = data.currentRoom;

            if (!room) {
                return;
            }

            const roomdoc = await room.get()
            const roomdata = await roomdoc.data();

            let newPlayers = roomdata.players;
            delete newPlayers[context.params.uid];
            console.log(newPlayers);
            room.update({
                players: newPlayers,
                turnOrder: admin.firestore.FieldValue.arrayRemove(context.params.uid)
            })//maybe merge false
        })
    });
