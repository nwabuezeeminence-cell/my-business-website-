// ===== NEXA NOTIFICATION SYSTEM (Frontend version) =====

let notificationCount = 0;

// Add notification
function addNotification(message) {

    const list = document.getElementById("notificationList");

    if (!list) return;

    const item = document.createElement("div");

    item.className = "notification-item";

    item.innerText = message;

    list.prepend(item);

    notificationCount++;

    updateBadge();

}

// Update badge number
function updateBadge() {

    const badge = document.getElementById("notificationBadge");

    if (badge) {
        badge.innerText = notificationCount;
    }

}

// Simulate welcome notification on load
window.onload = function () {

    addNotification("Welcome to NEXA Digital Services 🔥");

};

// Toggle notification panel
function toggleNotifications() {

    const list = document.getElementById("notificationList");

    if (!list) return;

    if (list.style.display === "block") {
        list.style.display = "none";
    } else {
        list.style.display = "block";
    }

}