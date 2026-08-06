// ===== NEXA Admin Dashboard =====
document.addEventListener("DOMContentLoaded", refreshDashboard);

const adminAuth = firebase.auth();
const adminDb = firebase.database();
const ADMIN_UID = "PUT_YOUR_UID_HERE";

let currentTab = 'users';

function refreshDashboard() {
    auth.onAuthStateChanged(user => {
        if(!user || user.uid !== ADMIN_UID){
            document.body.innerHTML = "<h2 style='text-align:center; color:red; padding:50px;'>Access Denied. Admins only.</h2>";
            return;
        }
        loadStats();
        showTab('users'); // default tab
    });
}

function showTab(tab){
    currentTab = tab;
    document.querySelectorAll('.admin-tab').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.btn-primary').forEach(b => b.style.opacity = '0.6');
    
    document.getElementById(tab + 'Tab').style.display = 'block';
    document.getElementById('btn' + tab.charAt(0).toUpperCase() + tab.slice(1)).style.opacity = '1';

    if(tab === 'users') loadUsers();
    if(tab === 'orders') loadOrders();
    if(tab === 'notifs') loadNotifications();
}

function loadStats(){
    db.ref("users").once("value").then(snap => {
        document.getElementById("totalUsers").textContent = snap.numChildren();
    });

    db.ref("orders").once("value").then(snap => {
        let total = 0;
        snap.forEach(userOrders => total += userOrders.numChildren());
        document.getElementById("totalOrders").textContent = total;
    });

    db.ref("notifications").once("value").then(snap => {
        let total = 0;
        snap.forEach(userNotifs => total += userNotifs.numChildren());
        document.getElementById("totalNotifs").textContent = total;
    });
}

// 1. USERS TAB
function loadUsers(){
    const list = document.getElementById("usersTab");
    list.innerHTML = "Loading...";
    db.ref("users").on("value", snap => {
        list.innerHTML = "";
        snap.forEach(user => {
            const u = user.val();
            list.innerHTML += `
                <div class="card" style="display:flex; align-items:center; gap:15px; margin-bottom:10px;">
                    <img src="${u.photo || 'default-avatar.png'}" style="width:50px; height:50px; border-radius:50%; object-fit:cover;">
                    <div>
                        <h3 style="margin:0;">${u.name || 'No Name'}</h3>
                        <p style="margin:0; color:var(--gray);">${u.email || ''}</p>
                        <p style="margin:0; color:var(--gray); font-size:12px;">Orders: ${u.orders || 0}</p>
                    </div>
                </div>
            `;
        });
    });
}

// 2. ORDERS TAB
function loadOrders(){
    const list = document.getElementById("ordersTab");
    list.innerHTML = "Loading...";
    db.ref("orders").on("value", snap => {
        list.innerHTML = "";
        snap.forEach(userOrders => {
            const userId = userOrders.key;
            userOrders.forEach(order => {
                const o = order.val();
                db.ref("users/" + userId).once("value").then(userSnap => {
                    const name = userSnap.val()?.name || "Unknown";
                    list.innerHTML += `
                        <div class="card" style="margin-bottom:15px;">
                            <h3>${o.service} - ₦${o.price}</h3>
                            <p>From: ${name}</p>
                            <p>Status: 
                                <select onchange="updateStatus('${userId}', '${order.key}', this.value)">
                                    <option ${o.status==='pending'?'selected':''}>pending</option>
                                    <option ${o.status==='processing'?'selected':''}>processing</option>
                                    <option ${o.status==='completed'?'selected':''}>completed</option>
                                </select>
                            </p>
                            <p style="font-size:12px; color:var(--gray);">${new Date(o.time).toLocaleString()}</p>
                        </div>
                    `;
                });
            });
        });
    });
}

// 3. NOTIFICATIONS TAB
function loadNotifications(){
    const list = document.getElementById("notifsTab");
    list.innerHTML = "Loading...";
    db.ref("notifications").on("value", snap => {
        list.innerHTML = "";
        snap.forEach(userNotifs => {
            const userId = userNotifs.key;
            userNotifs.forEach(notif => {
                const n = notif.val();
                db.ref("users/" + userId).once("value").then(userSnap => {
                    const name = userSnap.val()?.name || "Unknown";
                    list.innerHTML += `
                        <div class="card" style="margin-bottom:10px; opacity:${n.read ? 0.6 : 1};">
                            <h4>${n.title}</h4>
                            <p>${n.message}</p>
                            <p style="font-size:12px; color:var(--gray);">To: ${name} - ${new Date(n.time).toLocaleString()}</p>
                        </div>
                    `;
                });
            });
        });
    });
}

function updateStatus(userId, orderId, newStatus){
    db.ref(`orders/${userId}/${orderId}`).update({status: newStatus});
    db.ref(`notifications/${userId}`).push({
        title: "Order Update",
        message: `Your order status: ${newStatus}`,
        read: false,
        time: Date.now()
    });
    alert("Status Updated");
}