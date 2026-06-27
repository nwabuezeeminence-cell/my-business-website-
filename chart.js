// ===== NEXA CHAT SYSTEM (Frontend version) =====

let currentChat = "";

// Open a chat window
function openChat(name) {

    currentChat = name;

    document.getElementById("chatTitle").innerText = name;

    document.getElementById("chatWindow").classList.remove("hidden");

    document.getElementById("messages").innerHTML = "";

}

// Close chat window
function closeChat() {

    document.getElementById("chatWindow").classList.add("hidden");

}

// Send message
function sendMessage() {

    const input = document.getElementById("messageInput");

    const text = input.value.trim();

    if (text === "") return;

    const msgBox = document.createElement("div");

    msgBox.className = "my-message";

    msgBox.innerText = text;

    document.getElementById("messages").appendChild(msgBox);

    input.value = "";

    // Auto scroll
    document.getElementById("messages").scrollTop =
        document.getElementById("messages").scrollHeight;
}

// Optional: Enter key to send
document.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {

        if (!document.getElementById("chatWindow").classList.contains("hidden")) {
            sendMessage();
        }

    }

});