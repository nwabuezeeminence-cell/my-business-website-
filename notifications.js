// ===== NEXA Notifications =====
if(typeof firebase !== 'undefined'){

const auth = firebase.auth();
const db = firebase.database();
let currentUser = null;

auth.onAuthStateChanged((user)=>{
    if(!user){
        window.location.href = "login.html";
        return;
    }
    currentUser = user;
    loadNotifications();
    loadNotificationBadge();
});

function loadNotifications(){
    const list = document.getElementById("notificationList");
    if(!list) return;

    db.ref("notifications/" + currentUser.uid)
    .orderByChild("time")
    .on("value",(snapshot)=>{

        list.innerHTML = "";

        if(!snapshot.exists()){
            list.innerHTML = `
            <div class="card" style="text-align:center; color:var(--gray);">
                <i class="fas fa-bell-slash" style="font-size:40px; margin-bottom:10px; color:var(--border);"></i>
                <p>No notifications yet.</p>
            </div>
            `;
            return;
        }

        snapshot.forEach((child)=>{
            const notification = child.val();
            const notificationId = child.key;

            const card = document.createElement("div");
            card.className = notification.read ? "notif-card" : "notif-card unread";

            card.innerHTML = `
                <h3 style="margin:0 0 5px 0; color:var(--text);">${notification.title}</h3>
                <p style="margin:0 0 8px 0; color:var(--gray);">${notification.message}</p>
                <small class="notif-time">${new Date(notification.time).toLocaleString()}</small>
            `;

            // Mark as read when clicked
            card.onclick = ()=>{
                db.ref("notifications/" + currentUser.uid + "/" + notificationId)
                .update({ read: true });
            };

            list.appendChild(card);
        });
    });
}

function loadNotificationBadge(){
    // This updates the red number in the header
    const badge = document.getElementById("notifCount"); 
    if(!badge) return;

    db.ref("notifications/" + currentUser.uid)
    .orderByChild("read")
    .equalTo(false)
    .on("value",(snapshot)=>{
        const count = snapshot.numChildren();
        badge.textContent = count;
        badge.style.display = count > 0 ? "inline-block" : "none";
    });
}

} else {
    console.log("Firebase not loaded on notifications page");
}