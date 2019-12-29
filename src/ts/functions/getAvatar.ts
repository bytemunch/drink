async function getAvatar(uid) {
        const aviRef = firebase.storage().ref().child(`avatars/${uid}.png`);

        let aviImg = await aviRef.getDownloadURL()
            .catch(e => {
                //console.error(e);
                return '/img/noimg.png';
            })
    return aviImg;
}