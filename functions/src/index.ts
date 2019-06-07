// TODO classes and interfaces as module

interface ICard {
    suit: string,
    number: string
}

class Deck {
    public cards: Array<ICard> = [];
    constructor(private jokercount: number = 0) {
        const numbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "JK"];
        const suits = ["C", "D", "H", "S"];

        for (let n of numbers) {
            if (n != "JK") {
                for (let s of suits) {
                    this.cards.push({ suit: s, number: n });
                }
            } else {
                for (let i = 0; i < this.jokercount; i++) {
                    this.cards.push({ suit: n, number: n });
                }
            }
        }
    }
}

class RuleSet {
    public rules: Object;
    constructor() {
        this.rules = {
            "A": 'Waterfall',
            "2": 'Choose',
            "3": 'Me',
            "4": 'Whores',
            "5": 'ThumbMaster',
            "6": 'Dicks',
            "7": 'Heaven',
            "8": 'Mate',
            "9": 'Bust-a-Rhyme',
            "10": 'Categories',
            "J": 'Make a Rule',
            "Q": 'QuestionMaster',
            "K": 'Pour',
            "JK": 'Travolta',
        }
    }
}

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const cors = require('cors')({ origin: true });

const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

export const joinRoom = functions.https.onRequest((req, res) => {
    //TODO async await this shit up
    cors(req, res, () => {
        const data = JSON.parse(req.body);
        const roomRef = db.collection('rooms').doc(data.roomId)

        admin.auth().verifyIdToken(data.token)
            .then(userToken => {
                roomRef.get()
                    .then(snap => {
                        const doc = snap.data();

                        if (!userToken.uid) return Promise.reject('joinRoom: User not provided!');

                        if (!snap.exists) {
                            return Promise.reject({ err: 'joinRoom: Room not found!', code: '404' }); // not found
                        }

                        if (doc.state !== 'lobby') {
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
                        return db.collection('users').doc(userToken.uid).get();
                    })
                    .then(userdata => {
                        // add player to room
                        // TODO maybe split this out?
                        return db.runTransaction(t => {
                            return t.get(roomRef)
                                .then(roomDoc => {
                                    if (!roomDoc.exists) {
                                        return Promise.reject({ err: 'joinRoom: Room doesn\'t exist!', code: '500' }) // unknown server error
                                    }

                                    let players = roomDoc.data().players;

                                    if (!players[userToken.uid]) {

                                        players[userToken.uid] = userdata.data();

                                        players[userToken.uid].ready = false;

                                        t.update(roomRef, { players: players });
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

        const roomDocRef = db.collection('rooms').doc(data.roomId);

        admin.auth().verifyIdToken(data.token)
            .then(token => {
                db.runTransaction(t => {
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
                                return Promise.resolve();
                            } else {
                                return Promise.reject('createRoom: Room already exists!');
                            }
                        })
                })
            })

            .then(result => {
                res.send({ roomId: data.roomId, result });
            })
            .catch(err => {
                console.log(err);
                res.send({ roomId: false, err });
            });
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
            const rules = new RuleSet();
            const pin = createPin(4);
            const infoRef = snap.ref.parent.doc('roomsinfo');

            // Add to roomlist
            infoRef.set({ roomlist: { [roomId]: true } }, { merge: true });

            await db.runTransaction(t => {
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

            db.runTransaction(t => {
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
                db.collection('rooms').doc(data.roomId).get()
                    .then(doc => {
                        const room = doc.data();
                        if (token.uid != room.owner) {
                            Promise.reject({ err: 'User does not own room!', code: '403' })//forbidden
                        }

                        let turnOrder = [];
                        // Set turn order
                        // TODO pull this from data

                        for (let p in room.players) {
                            turnOrder.push(p);
                        }

                        // Set room state to playing
                        doc.ref.set({ turnOrder: turnOrder, state: 'playing' }, { merge: true })
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

export const drawCard = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const data = JSON.parse(req.body);

        admin.auth().verifyIdToken(data.token)
            .then(token => {
                db.collection('rooms').doc(data.roomId).get()
                    .then(doc => {
                        const room = doc.data();
                        if (token.uid != room.turnOrder[room.turnCounter]) {
                            Promise.reject({ err: 'Not your turn!', code: '403' })//forbidden
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
                            turnCounter: newTurnCount
                        }

                        doc.ref.set(newDataToMerge, { merge: true })
                            .then(() => {
                                res.send({ info: 'Turn taken', code: '200' })//OK
                            })
                    })
            })
            .catch(e => {
                console.error(e);
                res.send(e);
            })
    })
})