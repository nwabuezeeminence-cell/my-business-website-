// ===== ADMIN ACCESS PROTECTION =====

firebase.auth().onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    firebase.database().ref("users/" + user.uid).once("value")
    .then((snapshot) => {

        const data = snapshot.val();

        if (!data || data.role !== "admin") {
            alert("Access denied!");
            window.location.href = "index.html";
        }

    });

});