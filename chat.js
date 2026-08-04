let currentUser = null;
let allUsers = [];

auth.onAuthStateChanged(user => {
  if(!user) return window.location.href = "login.html";
  currentUser = user;
  loadConversations();
  loadAllUsers();
});

function goHome(){
  window.location.href = "index.html"; // or wherever your home is
}

// 2. SHOW USERS WHEN + IS CLICKED
function showUserList(){
  document.getElementById("userListPanel").style.display = "block";
  displayUsers(allUsers);
}
function closeUserList(){
  document.getElementById("userListPanel").style.display = "none";
}

// Load all users from database
function loadAllUsers(){
  db.ref("users").on("value", snap => {
    allUsers = [];
    snap.forEach(child => {
      if(child.key !== currentUser.uid){ // don't show yourself
        allUsers.push(child.val());
      }
    });
    // 3. SHOW "NO USERS" MESSAGE
    if(allUsers.length === 0){
      document.getElementById("noUsersMsg").style.display = "block";
    } else {
      document.getElementById("noUsersMsg").style.display = "none";
    }
  });
}

function displayUsers(users){
  const userList = document.getElementById("userList");
  userList.innerHTML = "";
  if(users.length === 0){
    document.getElementById("noUsersMsg").style.display = "block";
    return;
  }
  document.getElementById("noUsersMsg").style.display = "none";
  
  users.forEach(user => {
    userList.innerHTML += `
      <div class="user-item" onclick="startChat('${user.uid}')">
        <img src="${user.photo}" class="avatar">
        <div>
          <h4>${user.name}</h4>
          <p>${user.online ? 'Online' : 'Offline'}</p>
        </div>
      </div>
    `;
  });
}

function filterUsers(){
  const term = document.getElementById("userSearch").value.toLowerCase();
  const filtered = allUsers.filter(u => u.name.toLowerCase().includes(term));
  displayUsers(filtered);
}

function startChat(uid){
  closeUserList();
  window.location.href = `chatroom.html?uid=${uid}`;
}

function loadConversations(){
  // For now just hide empty state if we have chats
  // We'll build this properly later
}