import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const cors = require('cors')({ origin: true });

const firestore = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

// Functions I need in more than one place

function checkWin(room) {
    const winState = room.gamevars.winState;

    switch (winState.if) {
        case 'LAST_KING':
        default:
            if (!room.gamevars.deck.find(c => { return c.number == 'K' })) return winState.then;
    }

    return false;
}

export const leaveRoom = async function leaveRoom(uid, intended = false) {
    const userRef = firestore.collection('users').doc(uid);
    const userDoc = await userRef.get();
    const userData = await userDoc.data();
    const roomRef = userData.currentRoom;
    const roomDoc = await roomRef.get();
    const roomData = await roomDoc.data();

    const players = roomData.players;

    // Find all players containing our UID

    let newPlayers = { ...players };
    let toRemove = [];

    for (let playerUid in players) {
        if (playerUid.includes(uid)) {
            delete newPlayers[playerUid];
            toRemove.push(playerUid);
        }
    }

    const roomUpdated = roomRef.update({
        players: newPlayers,
        turnOrder: admin.firestore.FieldValue.arrayRemove(...toRemove)
    }, { merge: true })

    const userUpdateData = intended ? { currentRoom: '', prevRoom: '', prevPIN: '' } : { currentRoom: '', prevRoom: roomRef, prevPIN: roomData.pin };

    const userUpdated = userRef.set(userUpdateData, { merge: true })

    return Promise.all([roomUpdated, userUpdated]);

}

export const reqLeaveRoom = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        const data = JSON.parse(req.body);
        // REQUIRE TOKEN TO AUTH
        // {uid, roomId}

        res.send(leaveRoom(data.uid, true));
    })
})

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

                        if (!doc.pin) {
                            return Promise.reject({ err: 'joinRoom: Room has no pin!', code: '501' });// room broken
                        }

                        if (data.pin == "OWNER" && userToken.uid == doc.owner) {
                            return Promise.resolve();
                        }

                        if (doc.pin == data.pin) {
                            return Promise.resolve();
                        }


                        return Promise.reject({ err: 'joinRoom: Incorrect PIN!', code: '403' }); //forbidden
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

                                    let players = roomDoc.data().players;

                                    // make a copy and not just use a ref because
                                    // we are authed here. yay security
                                    players[userToken.uid] = userdata.data();

                                    // trim stuff
                                    delete players[userToken.uid].currentRoom;
                                    delete players[userToken.uid].prevRoom;
                                    delete players[userToken.uid].prevPIN;

                                    players[userToken.uid].ready = false;
                                    players[userToken.uid].hand = {};

                                    t.update(roomRef, { players: players });
                                    t.update(roomRef, { playerOrder: admin.firestore.FieldValue.arrayUnion(userToken.uid) })
                                    userdata.ref.set({ currentRoom: roomRef }, { merge: true })
                                    return Promise.resolve();

                                })
                        })
                    })
                    .then(() => {

                        res.send({ joined: true, roomId: data.roomId })
                    })
                    .catch(error => res.send({ error, joined: false }))
            })
            .catch(error => res.send({ error, joined: false }))
    });
})

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

export const rofDrawCard = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        const request = JSON.parse(req.body);

        const token = await admin.auth().verifyIdToken(request.token);

        const roomRef = firestore.collection('rooms').doc(request.roomId);

        const room = await roomRef.get().then(doc => doc.data());

        const nextPlayerUid = room.playerOrder[room.turn % room.playerOrder.length];

        if (token.uid != nextPlayerUid // if not next player
            && token.uid != nextPlayerUid.substring(0, nextPlayerUid.length - 2)) { // and not local player
            res.send({
                err: 'Not your turn!', code: '403',
                info: {
                    turn: nextPlayerUid,
                    suid: nextPlayerUid.substring(0, nextPlayerUid.length - 1),
                    uid: token.uid
                }
            })//forbidden

            return;
        }

        const cards = room.deck.cards;

        let n = Math.floor(Math.random() * cards.length);
        let chosenCard = cards[n];

        cards.splice(n, 1);

        roomRef.set({currentCard: chosenCard, deck:{cards}},{merge:true})
        .catch((e)=>console.error(e));

        res.send(chosenCard);
    })
});

export const ringoffireDrawCard = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const data = JSON.parse(req.body);

        admin.auth().verifyIdToken(data.token)
            .then(token => {
                firestore.collection('rooms').doc(data.roomId).get()
                    .then(doc => {
                        const room = doc.data();
                        const nextPlayerUid = room.turnOrder[room.turnCounter % room.turnOrder.length];
                        if (token.uid != nextPlayerUid
                            && token.uid != nextPlayerUid.substring(0, nextPlayerUid.length - 1)) {
                            // allows local device players to still draw cards
                            return Promise.reject({
                                err: 'Not your turn!', code: '403',
                                info: {
                                    turn: nextPlayerUid,
                                    suid: nextPlayerUid.substring(0, nextPlayerUid.length - 1),
                                    uid: token.uid
                                }
                            })//forbidden
                        }

                        // Pick card
                        let newCards = room.gamevars.deck;
                        const cardsInDeck = room.gamevars.deck.length;

                        const selectedCardNumber = Math.floor(Math.random() * cardsInDeck)
                        const selectedCard = room.gamevars.deck[selectedCardNumber];
                        newCards.splice(selectedCardNumber, 1)

                        let newDataToMerge = {
                            gamevars: {
                                // Set current card
                                currentCard: selectedCard,
                                // Remove current card from deck in room
                                deck: newCards,
                                rules: room.gamevars.rules
                            },
                            // set turn counter
                            turnCounter: admin.firestore.FieldValue.increment(1),
                            state: room.state
                        }

                        const gameOver = checkWin(room);

                        if (gameOver) {
                            // set room  state
                            newDataToMerge.gamevars.currentCard.action = gameOver.action;
                            newDataToMerge.state = 'finished';

                            // REFAC dont like this
                            newDataToMerge.gamevars.rules[selectedCard.number].desc = gameOver.desc;
                        }

                        return doc.ref.set(newDataToMerge, { merge: true })
                            .then(result => {
                                if (gameOver) doc.ref.delete();
                                return res.send({ info: 'Turn Taken', code: '200', result });
                            })
                    })
                    .catch(e => {
                        console.error(e);
                        res.send({ e, drawCard: 'error' });
                    })
            })
    })
})
