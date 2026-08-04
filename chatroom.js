let currentUser = null;
let otherUser = null;
let chatId = null;

// Get user and other user from URL
auth.onAuthStateChanged(user => {
  if(!user) window.location.href = "login.html";
  currentUser = user;
  
  const urlParams = new URLSearchParams(window.location.search);
  const otherUid = urlParams.get('uid');
  
  // Make chatId same for both people
  chatId = currentUser.uid < otherUid ? currentUser.uid + "_" + otherUid : otherUid + "_" + currentUser.uid;
  
  // Load other user info
  db.ref("users/" + otherUid).once("value").then(snap => {
    otherUser = snap.val();
    document.getElementById("otherName").innerText = otherUser.name;
    document.getElementById("otherPhoto").src = otherUser.photo;
  });
  
  loadMessages();
});

function loadMessages(){
  db.ref("messages/" + chatId).on("child_added", snap => {
    const msg = snap.val();
    showMessage(msg);
  });
}

function showMessage(msg){
  const div = document.createElement("div");
  div.className = msg.sender === currentUser.uid ? "msg me" : "msg them";
  div.innerHTML = `<p>${msg.text}</p><span>${new Date(msg.time).toLocaleTimeString().slice(0,5)}</span>`;
  document.getElementById("messages").appendChild(div);
  document.getElementById("messages").scrollTop = 999999;
}

function sendMsg(){
  const input = document.getElementById("msgInput");
  const text = input.value.trim();
  if(text === "") return;
  
  const msg = {
    sender: currentUser.uid,
    text: text,
    time: Date.now()
  };
  
  db.ref("messages/" + chatId).push(msg);
  input.value = "";
}

function goBack(){
  window.location.href = "chat.html";
}