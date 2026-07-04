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