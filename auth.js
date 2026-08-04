// ===== NEXA AUTH SYSTEM =====

// Sign Up
function signup(){
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const photo = document.getElementById("photo").files[0];

  auth.createUserWithEmailAndPassword(email, password)
.then(userCredential => {
    const user = userCredential.user;
    const storageRef = storage.ref("profilePics/" + user.uid);
    let url = "https://i.imgur.com/8Km9tLL.png"; // default avatar
    
    const upload = photo? storageRef.put(photo) : Promise.resolve();
    
    upload.then(snapshot => {
      if(snapshot) return snapshot.ref.getDownloadURL();
      return url;
    }).then(photoURL => {
        user.updateProfile({ displayName: name, photoURL: photoURL });
        
        // SAVE FULL USER DATA
        db.ref("users/" + user.uid).set({
          uid: user.uid,
          name: name,
          email: email,
          photo: photoURL,
          bio: "",
          online: true,
          lastSeen: Date.now()
        });
        
        alert("Signup successful!");
        window.location.href = "chat.html";
    });
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
