// PUT THIS AT THE TOP OF auth.js
firebase.auth().onAuthStateChanged((user) => {
    const currentPage = window.location.pathname.split("/").pop();
    
    if (user) {
        // If user IS logged in but they're on Login or Signup page, send to home
        if(currentPage === "Login.html" || currentPage === "signup.html"){
            location.href = "home.html"; // CHANGED FROM community.html
        }
    } else {
        // If user is NOT logged in but they're on home, send to login
        if(currentPage === "home.html"){
            location.href = "Login.html";
        }
    }
});


function handleLogin() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (email === "" || password === "") { 
        showPopup("Error", "Please fill all fields", "❌");
        return; 
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        showPopup("Success", "Login Successful!", "✓");
        // NO redirect here anymore. onAuthStateChanged handles it
    })
    .catch((error) => {
        showPopup("Error", error.message, "❌");
    });
}
function login(){
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    
    if(!email || !password){ alert("Fill all fields"); return; }

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        location.href = "index.html";
    })
    .catch(err => {
        alert(err.message);
    });
}

function forgotPass(){
    const email = prompt("Enter your email to reset password");
    if(email){
        firebase.auth().sendPasswordResetEmail(email)
        .then(() => alert("Reset link sent to " + email))
        .catch(err => alert(err.message));
    }
}

function togglePass(){
    const pass = document.getElementById("password");
    const icon = event.target;
    if(pass.type === "password"){
        pass.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        pass.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

// Auto redirect if already logged in
firebase.auth().onAuthStateChanged(user => {
    if(user && location.pathname.includes("login.html")){
        location.href = "communities.html";
    }
});