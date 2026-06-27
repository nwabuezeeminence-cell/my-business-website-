// ===== NEXA REAL USER CHAT SYSTEM =====

const db = firebase.database();

let currentChat = "global";
let currentUser = null;

// Get logged-in user info
firebase.auth().onAuthStateChanged((user) => {
    if (user) {

        currentUser = user;

        // Load profile name
        firebase.database().ref("users/" + user.uid).once("value")
        .then((snap) => {
            const data = snap.val();
            currentUser.displayName = data?.name || user.email;
        });

    } else {
        window.location.href = "login.html";
    }
});

// Open chat room
function openChat(name) {

    currentChat = name;

    document.getElementById("chatTitle").innerText = name;

    document.getElementById("chatWindow").classList.remove("hidden");

    loadMessages();

}

// Send message (REAL USER VERSION)
function sendMessage() {

    const input = document.getElementById("messageInput");

    const text = input.value.trim();

    if (text === "" || !currentUser) return;

    db.ref("chats/" + currentChat).push({
        message: text,
        sender: currentUser.displayName,
        uid: currentUser.uid,
        time: Date.now()
    });

    input.value = "";
}

// Load messages in real-time
function loadMessages() {

    const messagesDiv = document.getElementById("messages");

    messagesDiv.innerHTML = "";

    db.ref("chats/" + currentChat).off();

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