// ===== NEXA Global App Settings =====
if(typeof firebase !== 'undefined'){

    const settingsAuth = firebase.auth();
    const settingsDB = firebase.database();

    settingsAuth.onAuthStateChanged((user)=>{

        if(!user) return;

        settingsDB.ref("settings/" + user.uid)
        .on("value",(snapshot)=>{

            const settings = snapshot.val();
            if(!settings) return;

            // Apply Dark Mode
            if(settings.darkMode === true){
                document.body.classList.add("dark-mode");
            }else{
                document.body.classList.remove("dark-mode");
            }

        });

    });

} else {
    console.log("Firebase not loaded on this page");
}