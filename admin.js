// ===== NEXA ADMIN PANEL SYSTEM =====

// Load all users
function loadUsers() {

    const usersList = document.getElementById("usersList");

    firebase.database().ref("users").on("value", (snapshot) => {

        usersList.innerHTML = "";

        snapshot.forEach((child) => {

            const user = child.val();

            const div = document.createElement("div");

            div.className = "card";

            div.innerHTML = `
                <strong>${user.name || "No Name"}</strong><br>
                ${user.email || ""}
            `;

            usersList.appendChild(div);

        });

    });

}

// Load messages (global view)
function loadMessages() {

    const messagesList = document.getElementById("messagesList");

    firebase.database().ref("chats/global").on("child_added", (snapshot) => {

        const msg = snapshot.val();

        const div = document.createElement("div");

        div.className = "card";

        div.innerHTML = `
            <strong>${msg.sender}</strong><br>
            ${msg.message}
        `;

        messagesList.appendChild(div);

    });

}

// Start admin panel
window.onload = function () {
    loadUsers();
    loadMessages();
};