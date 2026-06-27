// ===== NEXA PROFILE SYSTEM (Firebase Realtime DB) =====

const user = firebase.auth().currentUser;

// Save profile
function saveProfile() {

    const name = document.getElementById("fullName").value;
    const bio = document.getElementById("bio").value;

    const user = firebase.auth().currentUser;

    if (!user) {
        alert("You must be logged in!");
        return;
    }

    firebase.database().ref("users/" + user.uid).set({
        name: name,
        bio: bio,
        email: user.email
    });

    alert("Profile saved!");
}

// Load profile
function loadProfile() {

    firebase.auth().onAuthStateChanged((user) => {

        if (user) {

            firebase.database().ref("users/" + user.uid).once("value")
            .then((snapshot) => {

                const data = snapshot.val();

                if (data) {

                    document.getElementById("fullName").value = data.name || "";
                    document.getElementById("bio").value = data.bio || "";

                    document.getElementById("profileName").innerText = data.name || "No Name";
                    document.getElementById("profileUsername").innerText = user.email;

                } else {
                    document.getElementById("profileUsername").innerText = user.email;
                }

            });

        } else {
            window.location.href = "login.html";
        }

    });

}

// Logout
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "login.html";
    });
}

// Auto run
window.onload = loadProfile;
