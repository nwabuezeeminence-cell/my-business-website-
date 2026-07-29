// ===== NEXA Messenger V2 =====

// auth and db already come from firebase.js

let currentUser = null;

// Page Elements
const newChatBtn = document.getElementById("newChatBtn");
const userPanel = document.getElementById("userSearchPanel");
const closePanel = document.getElementById("closePanel");
const usersContainer = document.getElementById("allUsers");

// Check Login
auth.onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    loadUsers();
    loadChats();

});

// Open User List
newChatBtn.onclick = () => {

    userPanel.classList.add("active");

};

// Close User List
closePanel.onclick = () => {

    userPanel.classList.remove("active");

};

// Load All Users
function loadUsers() {

    usersContainer.innerHTML = "";

    db.ref("users").on("value", (snapshot) => {

        usersContainer.innerHTML = "";

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

                sessionStorage.setItem("chatUser", JSON.stringify(user));

                window.location.href = "conversation.html";

            };

            usersContainer.appendChild(card);

        });

    });

}

// Load Existing Chats
function loadChats(){

    const list = document.getElementById("conversationList");

    db.ref("chats").on("value",(snapshot)=>{

        list.innerHTML = "";

        let hasChats = false;

        snapshot.forEach((child)=>{

            const chat = child.val();
            const chatId = child.key;

            if(!chat.members || !chat.members[currentUser.uid]) return;

            hasChats = true;

            const otherUid = Object.keys(chat.members).find(
                uid => uid !== currentUser.uid
            );

            db.ref("users/" + otherUid).once("value").then((userSnap)=>{

                const user = userSnap.val();

                const card = document.createElement("div");

                card.className = "chat-card";

                card.innerHTML = `

                    <img src="${user.profilePhoto || 'avatar.png'}">

                    <div class="chat-info">

                        <h3>${user.fullName}</h3>

                        <p>${chat.lastMessage || ""}</p>

                    </div>

                    <small>

                        ${new Date(chat.lastTime).toLocaleTimeString([],{
                            hour:"2-digit",
                            minute:"2-digit"
                        })}

                    </small>

                `;

                card.onclick = ()=>{

                    sessionStorage.setItem(
                        "chatUser",
                        JSON.stringify(user)
                    );

                    window.location.href = "conversation.html";

                };

                list.appendChild(card);

            });

        });

        if(!hasChats){

            list.innerHTML = `

                <div class="empty-chat">

                    <img src="NEXA.png" width="120">

                    <h2>No conversations yet</h2>

                    <p>

                        Tap the + button below to start chatting.

                    </p>

                </div>

            `;

        }

    });

}