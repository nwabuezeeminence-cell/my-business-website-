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
        });
        db.ref(
"notifications/" + user.uid
).push({

title:"Welcome to NEXA",

message:
"Your account has been created successfully.",

type:"system",

time:Date.now(),

read:false

});

});

});

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
    .then(() => {

        const user = firebase.auth().currentUser;
        db.ref(
"settings/" + user.uid + "/showOnline"
)
.once("value")
.then((snapshot)=>{


const showOnline =
snapshot.exists()
? snapshot.val()
: true;



db.ref("users/" + user.uid)
.update({

online: showOnline

});


});

       showPopup(
    "Welcome Back",
    "Login successful!"
);

setTimeout(() => {

    window.location.href = "index.html";

}, 1500);        

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
        window.location.href = "login.html";
    });

}

// Current User
function getUser() {
    return firebase.auth().currentUser;
}
