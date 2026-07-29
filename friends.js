// ===== NEXA Friends =====

const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;

// Page Elements
const peopleList = document.getElementById("peopleList");
const friendsList = document.getElementById("friendsList");
const requestList = document.getElementById("requestList");
const searchInput = document.getElementById("searchUser");

// Check Login
auth.onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    loadPeople();
    loadRequests();
    loadFriends();

});

// =========================
// Load All Users
// =========================

function loadPeople() {

    db.ref("users").on("value", (snapshot) => {

        peopleList.innerHTML = "";

        snapshot.forEach((child) => {

            const user = child.val();

            if (user.uid === currentUser.uid) return;

            const card = document.createElement("div");

            card.className = "user-card";

            card.innerHTML = `

                <img src="${user.profilePhoto || "avatar.png"}">

                <div class="user-info">

                    <h3>${user.fullName}</h3>

                    <small>

                        ${user.online ? "🟢 Online" : "⚪ Offline"}

                    </small>

                </div>

                <button class="add-friend">

                    Add Friend

                </button>

            `;

            card.querySelector("button").onclick = () => {

                sendFriendRequest(user);
                .then(()=>{



   // Check receiver notification settings first

db.ref(
"settings/" + user.uid + "/notifications"
)
.once("value")
.then((settingSnap)=>{


    const allowed =
    settingSnap.exists()
    ? settingSnap.val()
    : true;



    if(allowed){


        db.ref(
        "notifications/" + user.uid
        )
        .push({

            title:"New Friend Request",

            message:
            (currentUser.displayName ||
            "Someone")
            +
            " sent you a friend request.",

            type:"friend_request",

            from:currentUser.uid,

            time:Date.now(),

            read:false

        });


    }



});



    showPopup(
        "Friend Request Sent",
        "Your request has been sent successfully."
    );


});

            };
            

            peopleList.appendChild(card);

        });

    });

}

// =========================
// Send Friend Request
// =========================

function sendFriendRequest(user){

    db.ref("friendRequests/" + user.uid + "/" + currentUser.uid).set({
    
    
    // =========================
// Load Friend Requests
// =========================

function loadRequests(){

    db.ref("friendRequests/" + currentUser.uid)
    .on("value",(snapshot)=>{

        requestList.innerHTML="";

        if(!snapshot.exists()){

            requestList.innerHTML =
            "<div class='empty-card'>No pending requests.</div>";

            return;
        }


        snapshot.forEach((child)=>{

            const request = child.val();

            db.ref("users/" + request.from)
            .once("value")
            .then((userSnap)=>{

                const user = userSnap.val();

                if(!user) return;


                const card = document.createElement("div");

                card.className="user-card";


                card.innerHTML = `

                <img src="${user.profilePhoto || 'avatar.png'}">

                <div class="user-info">

                    <h3>${user.fullName}</h3>

                    <small>
                    Sent you a friend request
                    </small>

                </div>


                <button class="add-friend">
                    Accept
                </button>

                <button class="decline-btn">
                    Decline
                </button>

                `;


                card.querySelector(".add-friend")
                .onclick = ()=>{

                    acceptFriend(user.uid);

                };


                card.querySelector(".decline-btn")
                .onclick = ()=>{

                    declineFriend(user.uid);

                };


                requestList.appendChild(card);


            });


        });


    });


}

// =========================
// Accept Friend
// =========================

function acceptFriend(friendUid){


    db.ref("friends/" + currentUser.uid + "/" + friendUid)
    .set(true);


    db.ref("friends/" + friendUid + "/" + currentUser.uid)
    .set(true);



    db.ref(
        "friendRequests/" 
        + currentUser.uid 
        + "/" 
        + friendUid
    )
    .remove();


    showPopup(
        "Friend Added",
        "You are now friends."
    );


}

// =========================
// Decline Friend
// =========================

function declineFriend(friendUid){


    db.ref(
        "friendRequests/"
        + currentUser.uid
        + "/"
        + friendUid
    )
    .remove();


    showPopup(
        "Request Declined",
        "Friend request removed."
    );


}



       