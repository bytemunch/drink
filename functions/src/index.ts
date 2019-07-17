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
    const winState = room.winState;

    switch (winState.if) {
        case 'LAST_KING':
        default:
            if (!room.deck.find(c => { return c.number == 'K' })) return winState.then;
    }

    return false;
}

function findNextPlayer(room) {
    let newTurnCount = 0;
    // Reset turn counter to 0

    // IF turn counter is less than turnOrder.length
    if (room.turnCounter < room.turnOrder.length - 1) {
        // Increment turn counter
        newTurnCount = room.turnCounter + 1;
    } // else leave at 0

    // skip offline player's turns
    let nextPlayerUid = room.turnOrder[newTurnCount];
    let nextPlayerOffline = room.players[nextPlayerUid].status == 'offline';
    let loopSaver = 0;
    while (nextPlayerOffline && loopSaver < room.turnOrder.length - 1) {
        ++loopSaver;

        ++newTurnCount;
        if (newTurnCount > room.turnOrder.length - 1) newTurnCount = 0;

        nextPlayerUid = room.turnOrder[newTurnCount];
        if (room.players[nextPlayerUid]) {
            nextPlayerOffline = room.players[nextPlayerUid].status == 'offline';
        } else {
            console.log('no more players!');
        }
    }

    return newTurnCount;
}

async function leaveRoom(uid, userRef, roomRef, roomData) {
    // and turnorder
    const players = roomData.players;

    // remove player from room
    let newPlayers = { ...players };
    delete newPlayers[uid]

    roomRef.update({
        players: newPlayers,
        turnOrder: admin.firestore.FieldValue.arrayRemove(uid)
    }, { merge: true })

    userRef.set({
        currentRoom: '',
        prevRoom: roomRef,
        prevPIN: roomData.pin
    }, { merge: true })

    if (roomData.turnCounter == roomData.turnOrder.indexOf(uid)) {
        roomRef.set({ turnCounter: findNextPlayer(roomData) }, { merge: true });
    }

    // Check if the room we just offlined from has any online players
    // let playerCount = 0;

    // for (let p in players) {
    //     if (players[p].status == 'online')++playerCount;
    // }

    // if (playerCount == 0) {
    //     room.delete();
    //     return;
    // }
}

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

                                    let players = roomDoc.data().players;

                                    // make a copy and not just use a ref because
                                    // we are authed here. yay security
                                    players[userToken.uid] = userdata.data();

                                    // trim stuff
                                    delete players[userToken.uid].currentRoom;
                                    delete players[userToken.uid].prevRoom;
                                    delete players[userToken.uid].prevPIN;
                                    players[userToken.uid].status = 'online';

                                    players[userToken.uid].ready = false;
                                    players[userToken.uid].hand = {};

                                    t.update(roomRef, { players: players });
                                    t.update(roomRef, { turnOrder: admin.firestore.FieldValue.arrayUnion(userToken.uid) })
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

export const roomDeleted = functions.firestore
    .document('rooms/{roomId}')
    .onDelete(async (snap, ctx) => {
        const roomId = ctx.params.roomId;

        if (roomId !== 'roomsinfo') {
            const infoRef = snap.ref.parent.doc('roomsinfo');

            infoRef.set({ roomlist: { [roomId]: false } }, { merge: true });
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

                        const newTurnCount = findNextPlayer(room);

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
                        res.send({ e, drawCard: 'error' });
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

        userRef.get().then(async userRefDoc => {

            const data = await userRefDoc.data();

            const room = data.currentRoom;

            // No room, do nothing
            if (!room) {
                return;
            }

            // update player state in room
            await room.set({
                players: { [context.params.uid]: { status: eventStatus.state } },
            }, { merge: true })

            const roomdoc = await room.get()
            const roomdata = await roomdoc.data();


            // If user has offlined then change turnCounter in room
            // to valid player
            if (eventStatus.state == 'offline') {
                await leaveRoom(context.params.uid, userRef, room, roomdata);
            }


        })
    });
