// ===== ADMIN ACCESS PROTECTION =====
const MY_ADMIN_UID = "PUT_YOUR_UID_HERE"; // Get from Firebase Auth

firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Check 1: Is it me?
    if(user.uid === MY_ADMIN_UID){
        loadStats();
        showTab('users');
        return; // Let admin in
    }

    // Check 2: Check role in DB for other admins
    firebase.database().ref("users/" + user.uid).once("value")
    .then((snapshot) => {
        const data = snapshot.val();
        if (!data || data.role !== "admin") {
            alert("Access denied!");
            window.location.href = "index.html";
        } else {
            loadStats();
            showTab('users');
        }
    });
});
