iself.addEventListener("install", function(e){
  console.log("NEXA PWA Installed");
});

self.addEventListener("fetch", function(e){
  // basic offline support
});
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("nexa-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/about.html",
        "/services.html",
        "/contact.html",
        "/styles.css"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
function sendMessage() {
  let msg = document.getElementById("chatInput").value;

  // send to database (Firebase later)
  console.log("Message sent:", msg);

  document.getElementById("chatInput").value = "";
}
function toggleNotifications(){

  let menu =
    document.getElementById("notificationDropdown");

  if(menu.style.display === "block"){
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }

}

function openChat(){

  let chat =
    document.getElementById("chatWindow");

  if(chat.style.display === "block"){
    chat.style.display = "none";
  } else {
    chat.style.display = "block";
  }

}

function sendMessage(){

  let input =
    document.getElementById("chatInput");

  let message = input.value.trim();

  if(message === "") return;

  let area =
    document.getElementById("chatMessages");

  area.innerHTML +=
    "<div><strong>You:</strong> " +
    message +
    "</div>";

  input.value = "";

}
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
db.ref("test").set({
  status: "NEXA Connected"
});
function sendMessage() {
  let text = document.getElementById("chatInput").value;

  if (text === "") return;

  db.ref("chats/defaultUser").push({
    sender: "user",
    text: text,
    time: Date.now()
  });

  document.getElementById("chatInput").value = "";
}
db.ref("chats/defaultUser").on("child_added", (snapshot) => {
  let msg = snapshot.val();

  let div = document.createElement("div");
  div.textContent = msg.sender + ": " + msg.text;

  document.getElementById("messages").appendChild(div);
});
function sendMessage() {
  let text = document.getElementById("chatInput").value;

  if (!text) return;

  db.ref("chats/" + userId).push({
    text: text,
    sender: "user",
    time: Date.now()
  });

  document.getElementById("chatInput").value = "";
}
db.ref("chats/" + userId).on("child_added", (snapshot) => {
  let msg = snapshot.val();

  let div = document.createElement("div");

  div.textContent = (msg.sender === "admin" ? "Admin: " : "You: ") + msg.text;

  document.getElementById("messages").appendChild(div);
});
function toggleNotifications() {
  const box = document.getElementById("notifDropdown");

  if (box.style.display === "none") {
    box.style.display = "block";
  } else {
    box.style.display = "none";
  }
}
db.ref("notifications").on("child_added", (snapshot) => {
  let data = snapshot.val();

  let div = document.createElement("div");
  div.innerHTML = `
    <b>${data.title}</b><br>
    <small>${data.message}</small>
  `;

  document.getElementById("notifList").prepend(div);

  // update count
  let count = document.getElementById("notifCount");
  count.innerText = parseInt(count.innerText) + 1;

  // optional popup alert
  alert(data.title + " - " + data.message);
});
function sendNotification(title, message) {
  db.ref("notifications").push({
    title: title,
    message: message,
    time: Date.now(),
    read: false
  });
}
window.login = async function () {

  const email =
    document.getElementById("loginEmail").value.trim();

  const password =
    document.getElementById("loginPassword").value;

  try {

    await signInWithEmailAndPassword(auth, email, password);

    window.location.href = "community.html";

  } catch (error) {

    document.getElementById("loginStatus").textContent =
      error.message;

  }
}
await set(ref(database, "users/" + user.uid), {
    uid: user.uid,
    fullName: fullName,
    username: "@" + fullName.toLowerCase().replace(/\s+/g, ""),
    email: email,
    bio: "Hello! I'm new on NEXA.",
    profilePhoto: "",
    joined: new Date().toISOString(),
    online: true,
    lastSeen: Date.now(),
    role: "user",
    status: "Available"
});