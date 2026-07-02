// ===== NEXA AUTH SYSTEM (Firebase Email Login) =====

 {

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {

       // Sign Up
function signUp(email, password) {

    firebase.auth().createUserWithEmailAndPassword(email, password)

    .then((userCredential) => {

        const user = userCredential.user;

        firebase.database().ref("users/" + user.uid).set({

            name: email.split("@")[0],
            email: email,
            photo: "",
            bio: "Welcome to NEXA",
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