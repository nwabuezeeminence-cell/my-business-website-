// ===== NEXA Settings =====

const auth = firebase.auth();
const db = firebase.database();


let currentUser = null;



auth.onAuthStateChanged((user)=>{


    if(!user){

        window.location.href="login.html";

        return;

    }


    currentUser=user;


    loadSettings();


});




// Load saved settings

function loadSettings(){


    db.ref(
    "settings/" + currentUser.uid
    )

    .once("value")

    .then(snapshot=>{


        const settings=snapshot.val();



        if(!settings) return;



        document.getElementById("darkModeToggle")
        .checked=settings.darkMode || false;



        document.getElementById("notificationToggle")
        .checked=
        settings.notifications !== false;



        document.getElementById("onlineToggle")
        .checked=
        settings.showOnline !== false;



        if(settings.darkMode){

            document.body.classList.add("dark-mode");

        }



    });


}




// Dark Mode

document
.getElementById("darkModeToggle")
.onclick=function(){


const enabled=this.checked;


document.body.classList.toggle(
"dark-mode",
enabled
);


saveSetting(
"darkMode",
enabled
);


};




// Notification Toggle

document
.getElementById("notificationToggle")
.onclick=function(){


saveSetting(
"notifications",
this.checked
);


};




// Online Status

document
.getElementById("onlineToggle")
.onclick=function(){


saveSetting(
"showOnline",
this.checked
);


};





function saveSetting(key,value){


db.ref(
"settings/" + currentUser.uid + "/" + key
)

.set(value);


}





function goProfile(){

window.location.href="profile.html";

}




function changePassword(){


const password =
prompt(
"Enter new password"
);



if(!password) return;



currentUser
.updatePassword(password)
.then(()=>{


showPopup(
"Password Changed",
"Your password was updated."
);


});


}





document
.getElementById("logoutBtn")
.onclick=function(){


db.ref(
"users/" + currentUser.uid
)

.update({

online:false

});



auth.signOut()
.then(()=>{

window.location.href="login.html";

});


};