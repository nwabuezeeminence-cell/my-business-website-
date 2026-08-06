document.addEventListener("DOMContentLoaded", () => {

    const auth = firebase.auth();
    const db = firebase.database();
    const postsContainer = document.getElementById("postsContainer");
    const postBtn = document.getElementById("postBtn");
    const postText = document.getElementById("postText");
    const usersList = document.getElementById("usersList"); // might be null
    const searchBox = document.getElementById("searchUsers"); // might be null

    let currentUser = null;
    let currentUserData = {};

    // 1. CHECK USER LOGIN
    auth.onAuthStateChanged(user => {
        if(user){
            currentUser = user;
            db.ref("users/" + user.uid).once("value").then(snap => {
                currentUserData = snap.val() || {};
                const postBoxImg = document.querySelector(".post-box img");
                if(postBoxImg) postBoxImg.src = currentUserData.photoURL || 'https://i.imgur.com/6VBx3io.png';
            });
            loadPosts();
            if(usersList) loadUsers(); // only run if it exists
        } else {
            location.href = "login.html";
        }
    });

    // 2. CREATE POST
    if(postBtn){ // only add listener if button exists
        postBtn.addEventListener("click", () => {
            const text = postText.value.trim();
            if(text === "") return alert("Write something first");

            const postData = {
                uid: currentUser.uid,
                name: currentUserData.displayName || currentUser.email.split('@')[0],
                photo: currentUserData.photoURL || 'https://i.imgur.com/6VBx3io.png',
                text: text,
                time: Date.now(),
                likes: 0
            };

            db.ref("posts").push(postData);
            postText.value = "";
        });
    }

    // 3. LOAD POSTS - EMPTY IF NO POSTS
    function loadPosts(){
        if(!postsContainer) return;
        db.ref("posts").orderByChild("time").limitToLast(20).on("value", snapshot => {
            postsContainer.innerHTML = "";
            if(!snapshot.exists()){
                postsContainer.innerHTML = "<p style='text-align:center; padding:30px; color:#aaa;'>No posts yet. Be the first to post!</p>";
                return;
            }
            const posts = [];
            snapshot.forEach(child => posts.push({id: child.key,...child.val()}));
            posts.reverse().forEach(post => {
                const postEl = document.createElement("div");
                postEl.className = "post";
                postEl.innerHTML = `
                    <div class="post-header">
                        <img src="${post.photo}" alt="User">
                        <div>
                            <h4>${post.name}</h4>
                            <span>${timeAgo(post.time)}</span>
                        </div>
                    </div>
                    <p class="post-text">${post.text}</p>
                    <div class="post-actions">
                        <button onclick="likePost('${post.id}')"><i class="far fa-heart"></i> ${post.likes || 0}</button>
                        <button><i class="far fa-comment"></i> Comment</button>
                        <button><i class="far fa-share"></i> Share</button>
                    </div>
                `;
                postsContainer.appendChild(postEl);
            });
        });
    }

    // 4. LIKE FUNCTION
    window.likePost = function(postId){
        const postRef = db.ref("posts/" + postId + "/likes");
        postRef.transaction(current => (current || 0) + 1);
    }

    // 5. LOAD USERS - ONLY IF SECTION EXISTS
    function loadUsers(search = "") {
        if(!usersList) return; // stop if no usersList
        usersList.innerHTML = "<p>Loading...</p>";
        db.ref("users").once("value").then(snapshot => {
            usersList.innerHTML = "";
            if (!snapshot.exists()) {
                usersList.innerHTML = "<p>No members yet.</p>";
                return;
            }
            snapshot.forEach(child => {
                const user = child.val();
                const name = user.displayName || user.email.split('@')[0];
                if (name.toLowerCase().includes(search.toLowerCase())) {
                    const card = document.createElement("div");
                    card.className = "user-card";
                    card.style = "display:flex; align-items:center; gap:10px; background:#1A1A2E; padding:10px; margin:8px 0; border-radius:10px;";
                    card.innerHTML = `
                        <img src="${user.photoURL || 'profile.png'}" style="width:45px; height:45px; border-radius:50%;">
                        <div style="flex:1;">
                            <h3 style="font-size:15px;">${name}</h3>
                            <p style="font-size:12px; color:#aaa;">${user.email}</p>
                        </div>
                        <button onclick="openChat('${child.key}')" style="background:#E94560; border:none; color:white; padding:8px 12px; border-radius:8px;">
                            Message
                        </button>
                    `;
                    usersList.appendChild(card);
                }
            });
        });
    }

    if(searchBox){ // only add listener if searchbox exists
        searchBox.addEventListener("input", () => {
            loadUsers(searchBox.value);
        });
    }

});

function openChat(uid){
    localStorage.setItem("chatUser", uid);
    location.href="chat.html";
}

function timeAgo(timestamp){
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if(seconds < 60) return seconds + "s ago";
    const minutes = Math.floor(seconds/60);
    if(minutes < 60) return minutes + "m ago";
    const hours = Math.floor(minutes/60);
    if(hours < 24) return hours + "h ago";
    return Math.floor(hours/24) + "d ago";
}
