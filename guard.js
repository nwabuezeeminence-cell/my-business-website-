firebase.auth().onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "login.html";
"community.html";
"chat.html";
"group.html";
"profile.html";
"settings.html";
"admin.html";
        return;
    }

    db.ref("users/" + user.uid).update({
        online: true
    });

});