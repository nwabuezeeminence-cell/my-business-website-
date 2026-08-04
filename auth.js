// ===== NEXA AUTH SYSTEM =====

// Sign Up
function signUp(name, email, password) {

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {

        const user = userCredential.user;

        db.ref("users/" + user.uid).set({
            uid: user.uid,
            fullName: name,
            username: "@" + name.toLowerCase().replace(/\s+/g, ""),
            email: email,
            bio: "Welcome to NEXA!",
            profilePhoto: "",
            coverPhoto: "",
            joined: Date.now(),
            online: true,
            role: "user",
            status: "Available"
        }).then(() => {

            return db.ref("notifications/" + user.uid).push({
                title: "Welcome to NEXA",
                message: "Your account has been created successfully.",
                type: "system",
                time: Date.now(),
                read: false
            });

        }).then(() => {

            showPopup(
                "Account Created",
                "Welcome to NEXA!"
            );

            setTimeout(() => {
                window.location.href = "profile.html";
            }, 1500);

        });

    })
    .catch((error) => {
        alert(error.message);
    });

}

        showPopup(
    "Account Created",
    "Welcome to NEXA!"
);

setTimeout(() => {

    window.location.href = "profile.html";

}, 1500);

    })
    .catch((error) => {
        alert(error.message);
    });

}

// Login
function login(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => { // better to get user from here
        const user = userCredential.user;

        db.ref("users/" + user.uid).update({
            online: true,
            lastLogin: Date.now() // added this to track
        });

        showPopup(
            "Welcome Back 👋",
            "Login successful."
        );

        setTimeout(()=>{
            window.location.href="index.html";
        },1500);

    })
    .catch((error) => {
        showPopup("Login Failed", error.message); // use popup instead of alert
    });
}

// Logout - add this too
function logout(){
    const user = firebase.auth().currentUser;
    if(user){
        db.ref("users/" + user.uid).update({
            online: false
        });
    }
    firebase.auth().signOut().then(() => {
        showPopup("Logged Out", "See you next time!");
        setTimeout(()=>{
            window.location.href="login.html";
        },1000);
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
        window.location.href = "login.html";
    });

}

// Current User
function getUser() {
    return firebase.auth().currentUser;
}
