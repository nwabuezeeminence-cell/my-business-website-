// community.js

document.addEventListener("DOMContentLoaded", () => {

    const usersList = document.getElementById("usersList");
    const searchBox = document.getElementById("searchUsers");

    // Temporary demo users
    const users = [
        "Eminence",
        "NEXA Support",
        "John Doe",
        "Jane Smith",
        "Community Member"
    ];

    function displayUsers(filter = "") {

        usersList.innerHTML = "";

        const filteredUsers = users.filter(user =>
            user.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredUsers.length === 0) {
            usersList.innerHTML = "<p>No users found.</p>";
            return;
        }

        filteredUsers.forEach(user => {

            const card = document.createElement("div");
            card.className = "user-card";

            card.innerHTML = `
                <h3>${user}</h3>
                <button onclick="location.href='chat.html'">
                    Open Chat
                </button>
            `;

            usersList.appendChild(card);

        });

    }

    displayUsers();

    searchBox.addEventListener("input", () => {
        displayUsers(searchBox.value);
    });

});