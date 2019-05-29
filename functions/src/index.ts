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
    cors(req, res, () => {
        const data = JSON.parse(req.body);

        // TODO some sort of auth stuff

        // Check provided room exists

        const roomRef = db.collection('rooms').doc(data.roomId)

        roomRef.get()
            .then(snap => {
                const doc = snap.data();
                if (!snap.exists) {
                    return Promise.reject('joinRoom: Room not found!');
                }

                if (!doc.pin) {
                    return Promise.reject('joinRoom: Room has no pin!');
                }

                if (doc.pin == data.pin) {
                    return Promise.resolve();
                }

                return Promise.reject('joinRoom: Incorret PIN!');
            })
            .then(() => {
                // add player to room
                return db.runTransaction(t => {
                    return t.get(roomRef)
                        .then(roomDoc => {
                            if (!roomDoc.exists) {
                                return Promise.reject('joinRoom: Room doesn\'t exist!')
                            }

                            let players = roomDoc.data().players;

                            if (!players[data.user.uid]) {

                                players[data.user.uid] = data.user;

                                t.update(roomRef, { players: players });
                                return Promise.resolve();
                            } else {
                                return Promise.reject('joinRoom: Player already in room!')
                            }
                        })
                })
            })
            .then(() => res.send({ joined: true }))
            .catch(error => res.send({ error, joined: false }))
    });
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

        if (roomId !== 'roomsinfo') {
            const deck = new Deck();
            const rules = new RuleSet();
            const pin = createPin(4);
            const infoRef = snap.ref.parent.doc('roomsinfo');

            infoRef.set({ roomlist: {[roomId]:false} }, { merge: true });

            await db.runTransaction(t => {
                return t.get(infoRef).then(infoDoc => {
                    if (!infoDoc.exists) {
                        throw "No roomsinfo!";
                    }

                    // let newCount = infoDoc.data().roomcount + 1;
                    t.update(infoRef, { roomcount: admin.firestore.FieldValue.increment(1) });
                })
            }).then(() => { console.log('Transaction roomcount done') })
                .catch(e => console.error);

            snap.ref.set({
                deck: deck.cards,
                rules: rules.rules,
                currentCard: '',
                pin: pin,
                players: {},
                turnOrder: [],
                timestamp: {
                    created: admin.firestore.FieldValue.serverTimestamp(),
                    modified: admin.firestore.FieldValue.serverTimestamp()
                }
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

            infoRef.set({ roomlist: {[roomId]:false} }, { merge: true });

            await db.runTransaction(t => {
                return t.get(infoRef).then(infoDoc => {
                    if (!infoDoc.exists) {
                        throw "No roomsinfo!";
                    }

                    // let newCount = infoDoc.data().roomcount - 1;
                    t.update(infoRef, { roomcount: admin.firestore.FieldValue.increment(-1) });
                })
            }).then(() => { console.log('Transaction roomcount done') })
                .catch(e => console.error);
        }
    });