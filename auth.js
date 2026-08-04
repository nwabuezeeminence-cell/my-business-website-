
// ===== NEXA AUTH SYSTEM =====

// Sign Up
function signup(){
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const photoFile = document.getElementById("photo").files[0];

  auth.createUserWithEmailAndPassword(email, password)
 .then(cred => {
    const user = cred.user;
    let photoURL = "https://i.imgur.com/8Km9tLL.png"; // default

    const saveUser = (url) => {
      user.updateProfile({displayName: name, photoURL: url});
      db.ref("users/" + user.uid).set({
        uid: user.uid,
        name: name, // THIS WAS MISSING BEFORE
        email: email,
        photo: url, // THIS WAS MISSING BEFORE
        bio: "",
        online: true
      });
    }

    if(photoFile){
      storage.ref("profilePics/" + user.uid).put(photoFile)
     .then(snap => snap.ref.getDownloadURL())
     .then(url => saveUser(url));
    } else {
      saveUser(photoURL);
    }

    alert("Signup successful!");
    window.location.href = "chat.html";
  })
 .catch(err => alert(err.message));
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
