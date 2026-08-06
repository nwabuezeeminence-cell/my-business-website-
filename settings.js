let currentUser = null;

auth.onAuthStateChanged(user => {
    if(!user) return window.location.href = 'index.html';
    currentUser = user;
    loadUserSettings();
});

function loadUserSettings(){
    db.ref('users/' + currentUser.uid).once('value').then(snap => {
        let u = snap.val() || {};
        document.getElementById('darkMode').checked = u.darkMode || false;
        document.getElementById('notifications').checked = u.notifications !== false;
        document.getElementById('onlineStatus').checked = u.onlineStatus !== false;
    })
}

document.getElementById('darkMode').onchange = e => {
    db.ref('users/' + currentUser.uid + '/darkMode').set(e.target.checked);
    document.body.classList.toggle('dark', e.target.checked);
}
document.getElementById('notifications').onchange = e => {
    db.ref('users/' + currentUser.uid + '/notifications').set(e.target.checked);
}
document.getElementById('onlineStatus').onchange = e => {
    db.ref('users/' + currentUser.uid + '/onlineStatus').set(e.target.checked);
}

document.getElementById('editProfileBtn').onclick = () => {
    window.location.href = 'profile.html';
}
document.getElementById('changePasswordBtn').onclick = () => {
    let newPass = prompt("Enter new password:");
    if(newPass && newPass.length >= 6) {
        auth.currentUser.updatePassword(newPass)
        .then(() => alert("Password updated!"))
        .catch(err => alert(err.message));
    }
}

function logout(){
    auth.signOut().then(() => window.location.href = 'index.html');
}