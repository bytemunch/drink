import firebase from '../functions/firebase.js';

export default function deleteAllRooms() {
    firebase.firestore().collection('rooms').get().then(qSnap => {
        qSnap.forEach(doc => {
            if (doc.id !== 'roomsinfo')
                doc.ref.delete();
        });
    });
}
