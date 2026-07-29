// ===== NEXA Conversation =====

// auth and db come from firebase.js

let currentUser = null;
let selectedUser = null;
let chatId = null;

// Check Login
auth.onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    loadSelectedUser();

});

// Load selected user
function loadSelectedUser() {

    selectedUser = JSON.parse(sessionStorage.getItem("chatUser"));

    if (!selectedUser) {
        window.location.href = "chat.html";
        return;
    }

    document.getElementById("chatName").textContent =
        selectedUser.fullName;

    document.getElementById("chatStatus").textContent =
        selectedUser.status || "Available";

    document.getElementById("chatPhoto").src =
        selectedUser.profilePhoto || "avatar.png";

    chatId =
        currentUser.uid < selectedUser.uid
        ? currentUser.uid + "_" + selectedUser.uid
        : selectedUser.uid + "_" + currentUser.uid;

    loadMessages();

}

// Back button
document.getElementById("backBtn").onclick = () => {

    window.location.href = "chat.html";

};

// Load Messages
function loadMessages() {

    const container = document.getElementById("messages");

    db.ref("messages/" + chatId).on("value", (snapshot) => {

        container.innerHTML = "";

        if (!snapshot.exists()) {

            container.innerHTML = `
                <div class="empty-message">
                    <img src="NEXA.png" width="90">
                    <h3>No messages yet</h3>
                    <p>Say hello and start your conversation.</p>
                </div>
            `;

            return;
        }

        snapshot.forEach((child) => {

            const msg = child.val();

            const bubble = document.createElement("div");

            bubble.className =
                msg.sender === currentUser.uid
                ? "my-message"
                : "their-message";

            bubble.innerHTML = `
                <p>${msg.text}</p>
                <small>${new Date(msg.time).toLocaleTimeString()}</small>
            `;

            container.appendChild(bubble);

        });

        container.scrollTop = container.scrollHeight;

    });

}

// Send Button
document.getElementById("sendMessage").onclick = sendMessage;

// Enter Key
document.getElementById("messageInput").addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        sendMessage();

    }

});

// Send Message
function sendMessage(){

    const input = document.getElementById("messageInput");

    const text = input.value.trim();

    if(text === "") return;

    db.ref("messages/" + chatId).push({

    sender: currentUser.uid,
    text: text,
    time: Date.now(),
    status:"sent"

});

    });

    db.ref("chats/" + chatId).update({

    members:{
        [currentUser.uid]:true,
        [selectedUser.uid]:true
    },

    lastMessage:text,
    lastTime:Date.now()

});

    input.value="";
    input.focus();

}
