// Wait for the authentication state
firebase.auth().onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Load user information
    db.ref("users/" + user.uid).once("value")
    .then((snapshot) => {

        const data = snapshot.val();

        if (!data) return;

        document.getElementById("fullName").textContent =
            data.name || "NEXA User";

        document.getElementById("username").textContent =
            "@" + (data.name || "user")
            .toLowerCase()
            .replace(/\s+/g,"");

        document.getElementById("bio").value =
            data.bio || "";

    });

});

// Save Profile
document.getElementById("saveProfile").addEventListener("click", () => {

    const user = firebase.auth().currentUser;

    if (!user) return;

    db.ref("users/" + user.uid).update({

        bio: document.getElementById("bio").value

    }).then(() => {

        alert("Profile saved successfully!");

    });

});