document.addEventListener("DOMContentLoaded", () => {

    const usersList = document.getElementById("usersList");
    const searchBox = document.getElementById("searchUsers");

    function loadUsers(search = "") {

        usersList.innerHTML = "<p>Loading...</p>";

        firebase.database().ref("users").once("value")

        .then(snapshot => {

            usersList.innerHTML = "";

            if (!snapshot.exists()) {

                usersList.innerHTML = "<p>No members yet.</p>";

                return;
            }

            snapshot.forEach(child => {

                const user = child.val();

                if (
                    user.name &&
                    user.name.toLowerCase().includes(search.toLowerCase())
                ) {

                    const card = document.createElement("div");

                    card.className = "user-card";

                    card.innerHTML = `

                        <img src="${user.photo || 'profile.png'}" class="avatar">

                        <h3>${user.name}</h3>

                        <p>${user.email}</p>

                        <button onclick="openChat('${child.key}')">
                            Message
                        </button>

                    `;

                    usersList.appendChild(card);

                }

            });

        });

    }

    loadUsers();

    searchBox.addEventListener("input", () => {

        loadUsers(searchBox.value);

    });

});

function openChat(uid){

    localStorage.setItem("chatUser", uid);

    location.href="chat.html";

}