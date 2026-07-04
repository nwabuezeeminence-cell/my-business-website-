// ===== NEXA Notifications =====

firebase.auth().onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const notificationList = document.getElementById("notificationList");

    db.ref("notifications/" + user.uid)
    .orderByChild("time")
    .on("value", (snapshot) => {

        notificationList.innerHTML = "";

        if (!snapshot.exists()) {

            notificationList.innerHTML = `
                <p>No notifications yet.</p>
            `;

            return;
        }

        const notifications = [];

        snapshot.forEach((child) => {

            notifications.push({
                id: child.key,
                ...child.val()
            });

        });

        notifications.reverse();

        notifications.forEach((notification) => {

            const div = document.createElement("div");

            div.className = notification.read
                ? "notification-card"
                : "notification-card unread";

            div.innerHTML = `
                <h3>${notification.title}</h3>

                <p>${notification.message}</p>

                <small>
                    ${new Date(notification.time).toLocaleString()}
                </small>
            `;

            div.onclick = () => {

                db.ref(
                    "notifications/" +
                    user.uid +
                    "/" +
                    notification.id
                ).update({

                    read: true

                });

            };

            notificationList.appendChild(div);

        });

    });

});