
// ===== NEXA AUTH SYSTEM =====

// Sign Up
function signup(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if(password !== confirmPassword){
    return alert("Passwords do not match");
  }
  if(password.length < 6){
    return alert("Password must be at least 6 characters");
  }

  auth.createUserWithEmailAndPassword(email, password)
.then(userCredential => {
    const user = userCredential.user;
    
    // Create empty user profile. Will be filled in profile.html
    db.ref("users/" + user.uid).set({
      uid: user.uid,
      email: email,
      name: "",
      photo: "",
      bio: "",
      online: true,
      createdAt: Date.now()
    });
    
    alert("Account created! Let's set up your profile");
    window.location.href = "profile.html"; // THIS IS THE KEY REDIRECT
  })
.catch(error => alert(error.message));
}

function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
.then(() => window.location.href = "chat.html")
.catch(error => alert(error.message));
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
