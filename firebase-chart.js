// ===== NEXA FIREBASE REAL-TIME CHAT =====

const db = firebase.database();

let currentChat = "global";

// Open chat room
function openChat(name) {
    currentChat = name;

    document.getElementById("chatTitle").innerText = name;

    document.getElementById("chatWindow").classList.remove("hidden");

    loadMessages();
}

// Send message to Firebase
function sendMessage() {

    const input = document.getElementById("messageInput");

    const text = input.value.trim();

    if (text === "") return;

    db.ref("chats/" + currentChat).push({
        message: text,
        sender: "User",
        time: Date.now()
    });

    input.value = "";
}

// Load messages in real-time
function loadMessages() {

    const messagesDiv = document.getElementById("messages");

    messagesDiv.innerHTML = "";

    db.ref("chats/" + currentChat).on("child_added", (snapshot) => {

        const data = snapshot.val();

        const msg = document.createElement("div");

        msg.className = "message";

        msg.innerHTML = `
            <strong>${data.sender}</strong><br>
            ${data.message}
        `;

        messagesDiv.appendChild(msg);

        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

// Close chat
function closeChat() {
    document.getElementById("chatWindow").classList.add("hidden");
}