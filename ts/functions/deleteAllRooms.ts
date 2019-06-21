async function deleteAllRooms() {
    db.collection('rooms').get().then(qSnap => {
        qSnap.forEach(doc => {
            if (doc.id !== 'roomsinfo')
                console.log(doc.ref.delete());
        });
    });
}
