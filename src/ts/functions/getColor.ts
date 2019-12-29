async function getColor(uid) {
    const userDoc = await firestore.collection('users').doc(uid).get()
    const userData = await userDoc.data();

    return userData.color;

}