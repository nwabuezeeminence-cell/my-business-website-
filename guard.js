firebase.auth().onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    db.ref("users/" + user.uid).update({
        online: true
    });

});