let currentUser = null;
let allUsers = [];
let myFriends = []; // store my friend list

auth.onAuthStateChanged(user => {
  if(!user) return window.location.href = "login.html";
  currentUser = user;
  loadFriends(); // load my friends first
  loadAllUsers();
});

function goHome(){ window.location.href = "index.html"; }

// LOAD MY FRIENDS
function loadFriends(){
  db.ref("friends/" + currentUser.uid).on("value", snap => {
    myFriends = [];
    snap.forEach(child => {
      myFriends.push(child.key); // key = friend uid
    });
  });
}

// LOAD ALL USERS
function loadAllUsers(){
  db.ref("users").on("value", snap => {
    allUsers = [];
    snap.forEach(child => {
      if(child.key !== currentUser.uid){ // don't show myself
        allUsers.push(child.val());
      }
    });
    if(allUsers.length === 0){
      document.getElementById("noUsersMsg").style.display = "block";
    }
  });
}

function showUserList(){
  document.getElementById("userListPanel").style.display = "block";
  displayUsers(allUsers);
}
function closeUserList(){ document.getElementById("userListPanel").style.display = "none"; }

function displayUsers(users){
  const userList = document.getElementById("userList");
  userList.innerHTML = "";
  if(users.length === 0){
    document.getElementById("noUsersMsg").style.display = "block";
    return;
  }
  document.getElementById("noUsersMsg").style.display = "none";
  
  users.forEach(user => {
    const isFriend = myFriends.includes(user.uid);
    const btnText = isFriend ? "Message" : "Add Friend";
    const btnAction = isFriend ? `startChat('${user.uid}')` : `sendFriendRequest('${user.uid}')`;
    
    userList.innerHTML += `
      <div class="user-item">
        <img src="${user.photo}" class="avatar">
        <div style="flex:1">
          <h4>${user.name}</h4>
          <p>${user.online ? 'Online' : 'Offline'}</p>
        </div>
        <button class="button_1" style="padding:8px 15px; font-size:14px" onclick="${btnAction}">${btnText}</button>
      </div>
    `;
  });
}

function filterUsers(){
  const term = document.getElementById("userSearch").value.toLowerCase();
  const filtered = allUsers.filter(u => u.name.toLowerCase().includes(term));
  displayUsers(filtered);
}

// SEND FRIEND REQUEST
function sendFriendRequest(toUid){
  db.ref("friendRequests/" + toUid + "/" + currentUser.uid).set({
    from: currentUser.uid,
    name: currentUser.displayName,
    photo: currentUser.photoURL,
    timestamp: Date.now()
  });
  alert("Friend request sent!");
}

// START CHAT - only for friends
function startChat(uid){
  closeUserList();
  window.location.href = `chatroom.html?uid=${uid}`;
}