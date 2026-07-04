// ===== NEXA Notification Badge =====

firebase.auth().onAuthStateChanged((user) => {

    if (!user) return;

    const badge = document.getElementById("notificationBadge");

    if (!badge) return;

    db.ref("notifications/" + user.uid)
    .on("value", (snapshot) => {

        let unread = 0;

        snapshot.forEach((child) => {

            const notification = child.val();

            if (!notification.read) {
                unread++;
            }

        });

        if (unread > 0) {

            badge.style.display = "flex";
            badge.textContent = unread;

        } else {

            badge.style.display = "none";

        }

    });

});