self.addEventListener("install", function(e){
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