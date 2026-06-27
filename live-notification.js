// ===== LIVE NOTIFICATIONS SYSTEM =====

function listenNotifications() {

    const list = document.getElementById("notificationList");

    if (!list) return;

    firebase.database().ref("notifications").on("child_added", (snap) => {

        const data = snap.val();

        const item = document.createElement("div");

        item.className = "notification-item";

        item.innerText = data.message;

        list.prepend(item);

    });

}

// Auto start
window.onload = listenNotifications;