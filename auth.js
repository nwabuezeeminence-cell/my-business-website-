// ===== NEXA AUTH SYSTEM (Firebase Email Login) =====

// Sign Up
function signUp(name, email, password) {

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {

        const user = userCredential.user;

        db.ref("users/" + user.uid).set({
            uid: user.uid,
            fullName: name,
            email: email,
            bio: "",
            profilePhoto: "",
            status: "Available",
            online: true,
            joined: Date.now()
        });

        alert("Account created successfully!");

        window.location.href = "profile.html";

    })
    .catch((error) => {
        alert(error.message);
    });

}

// Login
function login(email, password) {

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {

        const user = firebase.auth().currentUser;

        db.ref("users/" + user.uid).update({
            online: true
        });

        alert("Login successful!");

        window.location.href = "index.html";

    })
    .catch((error) => {
        alert(error.message);
    });

}

// Logout
function logout() {

    const user = firebase.auth().currentUser;

    if (user) {
        db.ref("users/" + user.uid).update({
            online: false
        });
    }

    firebase.auth().signOut().then(() => {

        alert("Logged out");

        window.location.href = "login.html";

    });

}

// Get current user
function getUser() {

    return firebase.auth().currentUser;

}