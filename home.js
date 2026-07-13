const auth = firebase.auth();
const db = firebase.database();

auth.onAuthStateChanged(user=>{

    if(!user){

        location.href="login.html";

        return;

    }

    db.ref("users/"+user.uid).once("value").then(snapshot=>{

        const data=snapshot.val();

        document.getElementById("userName").textContent =
            data.fullName;

    });

});