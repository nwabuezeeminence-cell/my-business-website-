function placeOrder(serviceName, price){
    if(typeof firebase === 'undefined') return alert("Firebase not loaded");
    
    const user = firebase.auth().currentUser;
    if(!user) return window.location.href = "login.html";

    const db = firebase.database();
    const orderRef = db.ref("orders/" + user.uid).push(); // creates new order ID

    const orderData = {
        service: serviceName,
        price: price,
        status: "pending",
        time: Date.now(),
        id: orderRef.key
    };

    // 1. Save the order
    orderRef.set(orderData).then(() => {
        
        // 2. Increase order count by 1
        const userRef = db.ref("users/" + user.uid + "/orders");
        userRef.transaction(current => {
            return (current || 0) + 1;
        });

        // 3. Send notification to admin + user
        sendNotification(user.uid, `Order placed: ${serviceName}`);
        
        alert("Order placed successfully! ✅");
        window.location.href = "profile.html"; // take them to profile to see count go up
        
    }).catch(err => alert("Error: " + err.message));
}

function sendNotification(uid, message){
    const db = firebase.database();
    db.ref("notifications/" + uid).push({
        title: "New Order",
        message: message,
        read: false,
        time: Date.now()
    });
}