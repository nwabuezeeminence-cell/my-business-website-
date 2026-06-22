const db = firebase.database();

// ========================
// LOAD USERS
// ========================
function loadUsers() {
  db.ref("chats").on("value", (snapshot) => {
    const usersList = document.getElementById("usersList");
    usersList.innerHTML = "";

    snapshot.forEach(userSnap => {
      let userId = userSnap.key;

      let div = document.createElement("div");
      div.textContent = userId;

      div.onclick = () => loadChat(userId);

      usersList.appendChild(div);
    });
  });
}

let currentUser = null;

// ========================
// LOAD CHAT
// ========================
function loadChat(userId) {
  currentUser = userId;

  db.ref("chats/" + userId).on("child_added", (snap) => {
    let msg = snap.val();

    let div = document.createElement("div");
    div.textContent = msg.sender + ": " + msg.text;

    document.getElementById("adminMessages").appendChild(div);
  });
}

// ========================
// SEND ADMIN MESSAGE
// ========================
function sendAdminMessage() {
  let text = document.getElementById("adminInput").value;

  if (!currentUser || !text) return;

  db.ref("chats/" + currentUser).push({
    sender: "admin",
    text: text,
    time: Date.now()
  });

  document.getElementById("adminInput").value = "";
}

// ========================
// SEND NOTIFICATION
// ========================
function sendNotification() {
  let title = document.getElementById("notifTitle").value;
  let msg = document.getElementById("notifMsg").value;

  db.ref("notifications").push({
    title: title,
    message: msg,
    time: Date.now(),
    read: false
  });

  alert("Notification Sent!");
}

// START
loadUsers();