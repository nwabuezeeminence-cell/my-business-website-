// ===== NEXA Notifications =====


const auth = firebase.auth();

const db = firebase.database();


let currentUser=null;



auth.onAuthStateChanged((user)=>{


if(!user){

window.location.href="login.html";

return;

}


currentUser=user;

loadNotifications();

loadNotificationBadge();


loadNotifications();



});




function loadNotifications(){


const list =
document.getElementById("notificationList");



db.ref(
"notifications/"
+
currentUser.uid
)

.orderByChild("time")

.on("value",(snapshot)=>{


list.innerHTML="";


if(!snapshot.exists()){


list.innerHTML=
`
<div class="empty-card">

No notifications yet.

</div>
`;

return;


}



snapshot.forEach((child)=>{


const notification = child.val();

const notificationId = child.key;


const card = document.createElement("div");


card.className = 
notification.read 
? "notification-card"
: "notification-card unread";



card.innerHTML = `

<h3>

${notification.title}

</h3>


<p>

${notification.message}

</p>


<small>

${new Date(notification.time)
.toLocaleString()}

</small>

`;



// Mark as read when clicked

card.onclick = ()=>{


db.ref(
"notifications/"
+
currentUser.uid
+
"/"
+
notificationId

)

.update({

read:true

});


};



list.appendChild(card);



});



card.innerHTML=

`

<h3>

${notification.title}

</h3>


<p>

${notification.message}

</p>


<small>

${new Date(notification.time)
.toLocaleString()}

</small>


`;



list.appendChild(card);



});



});


}
function loadNotificationBadge(){


const badge =
document.getElementById("notificationBadge");


if(!badge) return;



db.ref(
"notifications/"
+
currentUser.uid
)

.orderByChild("read")

.equalTo(false)

.on("value",(snapshot)=>{


const count =
snapshot.numChildren();



if(count > 0){

badge.textContent=count;

badge.style.display="flex";


}else{

badge.style.display="none";

}



});


}
