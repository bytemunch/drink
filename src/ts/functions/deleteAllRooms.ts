function deleteAllRooms() {
    // console.log('Function disabled!');
    // return;

    firestore.collection('rooms').get().then(qSnap => {
        qSnap.forEach(doc => {
            if (doc.id !== 'roomsinfo')
                doc.ref.delete();
        });
    });
}
