// admin.js

document.addEventListener("DOMContentLoaded", refreshDashboard);

function refreshDashboard() {

    const profile =
        JSON.parse(localStorage.getItem("nexaProfile"));

    const groups =
        JSON.parse(localStorage.getItem("nexaGroups")) || [];

    document.getElementById("totalUsers").textContent =
        profile ? 1 : 0;

    document.getElementById("totalGroups").textContent =
        groups.length;

    document.getElementById("totalMessages").textContent =
        "Demo";

}