
// ===== NEXA AUTH SYSTEM =====

// Sign Up
function signup(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
.then(userCredential => {
    const user = userCredential.user;
    
    // Only save email + uid for now
    db.ref("users/" + user.uid).set({
      uid: user.uid,
      email: email,
      name: "", // empty for now
      photo: "",
      bio: "",
      online: true
    });
    
    alert("Account created! Let's set up your profile");
    window.location.href = "profile.html"; // REDIRECT HERE
  })
.catch(error => alert(error.message));
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
