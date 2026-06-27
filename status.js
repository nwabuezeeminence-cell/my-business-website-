// ===== NEXA ONLINE STATUS SYSTEM =====

let userRef = null;

// Track user online status
firebase.auth().onAuthStateChanged((user) => {

    if (user) {

        userRef = firebase.database().ref("status/" + user.uid);

        // Set user online
        userRef.set({
            state: "online",
            lastChanged: Date.now()
        });

        // Set offline when user disconnects
        userRef.onDisconnect().set({
            state: "offline",
            lastChanged: Date.now()
        });

    }

});