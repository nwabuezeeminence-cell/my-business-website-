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

function startChat(user){

    const chatId = currentUser.uid < user.uid
        ? currentUser.uid + "_" + user.uid
        : user.uid + "_" + currentUser.uid;

    db.ref("chats/" + chatId).once("value").then((snapshot)=>{

        if(!snapshot.exists()){

            db.ref("chats/" + chatId).set({

                createdAt: Date.now(),

                lastMessage: "",

                lastTime: Date.now(),

                members:{

                    [currentUser.uid]: true,

                    [user.uid]: true

                }

            });

        }


        openChat(chatId,user);

    });

}
let currentChatId = null;

function openChat(chatId,user){

    currentChatId = chatId;

    document.getElementById("chatName").textContent =
        user.fullName;

    document.getElementById("chatStatus").textContent =
        user.status || "Available";

    document.getElementById("chatPhoto").src =
        user.profilePhoto || "avatar.png";

    loadMessages(chatId);

}
function loadMessages(chatId){

    const messages = document.getElementById("messages");

    messages.innerHTML = "";

    db.ref("messages/" + chatId)
    .on("value",(snapshot)=>{

        messages.innerHTML="";

        snapshot.forEach((child)=>{

            const msg = child.val();

            const bubble = document.createElement("div");

            bubble.className =
                msg.sender===currentUser.uid
                ? "my-message"
                : "their-message";

            bubble.innerHTML=`

                <p>${msg.text}</p>

                <small>

                    ${new Date(msg.time).toLocaleTimeString()}

                </small>

            `;

            messages.appendChild(bubble);

        });
bubble.scrollIntoView({
    behavior:"smooth"
});

        messages.scrollTop = messages.scrollHeight;

    });

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
// ===== Send Message =====

document.getElementById("sendMessage").onclick = sendMessage;

document.getElementById("messageInput").addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        sendMessage();

    }

});

function sendMessage(){

    if(!currentChatId) return;

    const input = document.getElementById("messageInput");

    const text = input.value.trim();

    if(text === "") return;

    const message = {

        sender: currentUser.uid,

        text: text,

        time: Date.now(),

        status: "sent"

    };

    const messageRef = db.ref("messages/" + currentChatId).push();

    messageRef.set(message);

    db.ref("chats/" + currentChatId).update({

        lastMessage: text,

        lastTime: Date.now()

    });

    input.value = "";

}
const chatRoom = document.querySelector(".chat-room");

function openChat(){
    chatRoom.classList.add("active");
}

function closeChat(){
    chatRoom.classList.remove("active");
}
document
.getElementById("backBtn")
.onclick = function(){

    document
    .querySelector(".chat-room")
    .classList.remove("active");

};
const emojiBtn = document.getElementById("emojiBtn");
const emojiPanel = document.getElementById("emojiPanel");
const input = document.getElementById("messageInput");

emojiBtn.onclick = () => {

    emojiPanel.classList.toggle("active");

};

document.querySelectorAll(".emoji-panel span").forEach(emoji=>{

    emoji.onclick=()=>{

        input.value+=emoji.textContent;

        input.focus();

    };

});