// ===== NEXA CHAT.JS V2 WITH FRIENDS =====
let currentUser = null;
let allUsersData = {};
let myFriends = {};


// ELEMENTS
const newChatBtn = document.getElementById('newChatBtn');
const userPanel = document.getElementById('userPanel');
const closePanel = document.getElementById('closePanel');
const panelTitle = document.getElementById('panelTitle');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if(newChatBtn) newChatBtn.onclick = () => { userPanel.classList.add('active'); showTab('friends'); }
if(closePanel) closePanel.onclick = () => userPanel.classList.remove('active');

tabBtns.forEach(btn => {
    btn.onclick = () => showTab(btn.dataset.tab);
})

function showTab(tab){
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(tab === 'friends'? 'friendsList' : 'allUsers').classList.add('active');
    panelTitle.innerText = tab === 'friends'? 'My Friends' : 'Add Friend';
}

// 1. LOAD CONVERSATIONS
function loadConversations(){
    db.ref('conversations').orderByChild('lastTime').on('value', snap => {
        const conversationList = document.getElementById('conversationList');
        conversationList.innerHTML = '';
        if(!snap.exists()){
            conversationList.innerHTML = `
            <div class="empty-chat">
                <img src="img/NEXA.png" width="120" onerror="this.src='avatar.png'">
                <h2>No conversations yet</h2>
                <p>Tap the + button below to start your first conversation.</p>
            </div>`;
            return;
        }
        snap.forEach(child => {
            let c = child.val();
            if(c.users && c.users[currentUser.uid]){
                let otherId = Object.keys(c.users).find(id => id!== currentUser.uid);
                db.ref('users/'+otherId).once('value').then(uSnap => {
                    let u = uSnap.val();
                    if(!u) return;
                    let card = `
                    <div class="chat-card" onclick="startChat('${otherId}')">
                        <img src="${u.avatar || 'avatar.png'}">
                        <div class="chat-info">
                            <h3>${u.username}</h3>
                            <p>${c.lastMsg || 'Start chatting'}</p>
                        </div>
                        <small>${new Date(c.lastTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</small>
                    </div>`;
                    conversationList.innerHTML += card;
                })
            }
        })
    })
}

// 2. LOAD FRIENDS
function loadFriends(){
    db.ref('friends/' + currentUser.uid).on('value', snap => {
        myFriends = snap.val() || {};
        renderFriends();
    })
}

function renderFriends(){
    const div = document.getElementById('friendsList');
    div.innerHTML = '';
    let friendIds = Object.keys(myFriends);

    if(friendIds.length === 0){
        div.innerHTML = `
        <div class="empty-state">
            <h3>No Friends Yet 😅</h3>
            <p>Add friends to start chatting</p>
            <button onclick="showTab('all')">ADD FRIEND</button>
        </div>`;
        return;
    }

    friendIds.forEach(uid => {
        db.ref('users/'+uid).once('value').then(uSnap => {
            let u = uSnap.val();
            if(!u) return;
            div.innerHTML += `
            <div class="user-card">
                <img src="${u.avatar || 'avatar.png'}">
                <div style="flex:1">
                    <b>${u.username}</b><br>
                    <small>${u.status || 'Online'}</small>
                    <div class="user-actions">
                        <button class="btn-msg" onclick="startChat('${uid}')">Message</button>
                        <button class="btn-profile" onclick="viewProfile('${uid}')">View Profile</button>
                    </div>
                </div>
            </div>`;
        })
    })
}

// 3. LOAD ALL USERS
function loadAllUsers(){
    db.ref('users').on('value', snap => {
        allUsersData = snap.val() || {};
        renderAllUsers();
    })
}

function renderAllUsers(){
    const div = document.getElementById('allUsers');
    div.innerHTML = '';
    Object.keys(allUsersData).forEach(uid => {
        if(uid === currentUser.uid) return;
        let u = allUsersData[uid];
        let isFriend = myFriends[uid];

        let buttons = isFriend? `
            <button class="btn-msg" onclick="startChat('${uid}')">Message</button>
            <button class="btn-profile" onclick="viewProfile('${uid}')">View Profile</button>
        ` : `
            <button class="btn-add" onclick="addFriend('${uid}')">+ Add Friend</button>
        `;

        div.innerHTML += `
        <div class="user-card">
            <img src="${u.avatar || 'avatar.png'}">
            <div style="flex:1">
                <b>${u.username}</b><br>
                <small>${u.status || 'Online'}</small>
                <div class="user-actions">${buttons}</div>
            </div>
        </div>`;
    })
}

// 4. ADD FRIEND
function addFriend(uid){
    db.ref('friends/' + currentUser.uid + '/' + uid).set(true);
    db.ref('friends/' + uid + '/' + currentUser.uid).set(true); // 2-way
    alert('Friend Added!');
}

// 5. START CHAT
function startChat(uid){
    let chatId = [currentUser.uid, uid].sort().join('_');
    db.ref('conversations/'+chatId).set({
        users: {[currentUser.uid]: true, [uid]: true},
        lastMsg: '',
        lastTime: Date.now()
    })
    window.location.href = `conversation.html?chatId=${chatId}`;
}

function viewProfile(uid){
    window.location.href = `profile.html?id=${uid}`;
}

function logout(){
    auth.signOut().then(() => window.location.href = 'index.html');
}    