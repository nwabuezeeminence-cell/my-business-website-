// ===== NEXA AUTH SYSTEM (Firebase Email Login) =====

// Sign Up
function signUp(email, password) {

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {

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
    .then((userCredential) => {

        alert("Login successful!");

        window.location.href = "index.html";

    })
    .catch((error) => {
        alert(error.message);
    });

}

// Logout
function logout() {

    firebase.auth().signOut().then(() => {

        alert("Logged out");

        window.location.href = "login.html";

    });

}

// Get current user
function getUser() {

    return firebase.auth().currentUser;

}