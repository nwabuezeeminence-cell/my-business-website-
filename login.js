// Login
function login(email, password) {

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {

        const user = firebase.auth().currentUser;

        db.ref("users/" + user.uid).update({
            online: true
        });

        showPopup(
    "Welcome Back",
    "Login successful."
);

setTimeout(()=>{

    window.location.href="index.html";

},1500);

    })
    .catch((error) => {
        alert(error.message);
    });

}
