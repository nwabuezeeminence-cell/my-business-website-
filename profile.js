// Wait for the authentication state
firebase.auth().onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "profile.html";
        return;
    }

    // Load user information
    db.ref("users/" + user.uid).once("value")
    .then((snapshot) => {

    const data = snapshot.val();

    if (!data) return;

    document.getElementById("fullName").textContent =
        data.fullName || "NEXA User";

    document.getElementById("username").textContent =
        data.username || "@user";

    document.getElementById("bio").value =
        data.bio || "";

    if (data.profilePhoto) {
        document.getElementById("profilePreview").src =
            data.profilePhoto;
    }

    if (data.coverPhoto) {
        document.getElementById("coverPreview").src =
            data.coverPhoto;
    }

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