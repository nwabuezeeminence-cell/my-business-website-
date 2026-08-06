// ===== NEXA Profile =====
if(typeof firebase!== 'undefined'){

const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();
let currentUser = null;

auth.onAuthStateChanged(user => {
    if(!user){
        window.location.href = "login.html";
        return;
    }
    currentUser = user;
    loadProfile();
});

function loadProfile(){
    db.ref("users/" + currentUser.uid).once("value").then(snap => {
        const data = snap.val() || {};
        document.getElementById("fullName").innerText = data.name || currentUser.displayName || "NEXA User";
        document.getElementById("username").innerText = "@" + (data.username || currentUser.uid.slice(0,6));
        document.getElementById("email").innerHTML = `<i class="fas fa-envelope"></i> ${currentUser.email}`;
        document.getElementById("phone").value = data.phone || "";
        document.getElementById("location").value = data.location || "Lagos, Nigeria";
        document.getElementById("bio").value = data.bio || "";
        document.getElementById("whatsapp").value = data.whatsapp || "";
        document.getElementById("instagram").value = data.instagram || "";
        document.getElementById("orderCount").innerText = data.orders || 0;
        document.getElementById("memberSince").innerText = new Date(currentUser.metadata.creationTime).getFullYear();
        document.getElementById("accountType").innerText = data.type || "Student";
        if(data.photo) document.getElementById("profilePreview").src = data.photo;
        if(data.cover) document.getElementById("coverPreview").src = data.cover;
    });
}

// Upload images
document.getElementById("profileInput").onchange = e => uploadImage(e, "photo", "profilePreview");
document.getElementById("coverInput").onchange = e => uploadImage(e, "cover", "coverPreview");

function uploadImage(e, field, previewId){
    const file = e.target.files[0];
    if(!file) return;
    const ref = storage.ref("users/" + currentUser.uid + "/" + field + ".jpg");
    ref.put(file).then(() => ref.getDownloadURL()).then(url => {
        db.ref("users/" + currentUser.uid).update({[field]: url});
        document.getElementById(previewId).src = url;
        alert(field + " updated ✅");
    }).catch(err => alert("Upload failed: " + err.message));
}

// Save all fields
document.getElementById("saveProfile").onclick = () => {
    const updates = {
        name: document.getElementById("fullName").innerText,
        phone: document.getElementById("phone").value,
        location: document.getElementById("location").value,
        bio: document.getElementById("bio").value,
        whatsapp: document.getElementById("whatsapp").value,
        instagram: document.getElementById("instagram").value
    };
    db.ref("users/" + currentUser.uid).update(updates)
  .then(() => alert("Profile Saved Successfully ✅"))
  .catch(err => alert("Error: " + err.message));
}

} else {
    console.log("Firebase not loaded");
}