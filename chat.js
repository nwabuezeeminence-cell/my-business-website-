// ===== NEXA Messenger =====

const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;

auth.onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    loadUsers();

});

const newChatBtn = document.getElementById("newChat");
const searchPanel = document.getElementById("userSearchPanel");

newChatBtn.onclick = () => {

    if (searchPanel.style.display === "block") {

        searchPanel.style.display = "none";

    } else {

        searchPanel.style.display = "block";

    }

};

function loadUsers() {

    const usersDiv = document.getElementById("allUsers");

    db.ref("users").on("value", (snapshot) => {

        usersDiv.innerHTML = "";

        snapshot.forEach((child) => {

            const user = child.val();

            if (user.uid === currentUser.uid) return;

            const card = document.createElement("div");

            card.className = "user-card";

            card.innerHTML = `

                <img src="${user.profilePhoto || 'avatar.png'}">

                <div>

                    <b>${user.fullName}</b><br>

                    <small>${user.status || "Available"}</small>

                </div>

            `;

            card.onclick = () => {

                startChat(user);

            };

            usersDiv.appendChild(card);

        });

    });

}

function startChat(user){

    alert("Starting chat with " + user.fullName);

}
document.getElementById("findUser").addEventListener("input", function(){

    const search = this.value.toLowerCase();

    document.querySelectorAll(".user-card").forEach(card=>{

        if(card.innerText.toLowerCase().includes(search)){

            card.style.display="flex";

        }else{

            card.style.display="none";

        }

    });

});