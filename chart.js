// chat.js

let currentChat = "NEXA Support";

const demoChats = {
    "NEXA Support": [
        {
            sender: "NEXA Support",
            text: "Welcome to NEXA Messenger!"
        }
    ]
};

function openChat(name) {

    currentChat = name;

    document.getElementById("chatTitle").textContent = name;

    loadMessages();

}

function loadMessages() {

    const messages = document.getElementById("messages");

    messages.innerHTML = "";

    const chat = demoChats[currentChat] || [];

    if (chat.length === 0) {

        messages.innerHTML = "<p>No messages yet.</p>";

        return;

    }

    chat.forEach(msg => {

        const div = document.createElement("div");

        div.className = "message";

        div.innerHTML =
            "<strong>" +
            msg.sender +
            ":</strong> " +
            msg.text;

        messages.appendChild(div);

    });

    messages.scrollTop = messages.scrollHeight;

}

function sendMessage() {

    const input = document.getElementById("chatInput");

    const text = input.value.trim();

    if (text === "") return;

    if (!demoChats[currentChat]) {

        demoChats[currentChat] = [];

    }

    demoChats[currentChat].push({

        sender: "You",

        text: text

    });

    input.value = "";

    loadMessages();

}

document.addEventListener("DOMContentLoaded", () => {

    openChat("NEXA Support");

});