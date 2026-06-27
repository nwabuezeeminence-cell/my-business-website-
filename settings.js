// settings.js

document.addEventListener("DOMContentLoaded", loadSettings);

function loadSettings() {

    const settings = JSON.parse(localStorage.getItem("nexaSettings"));

    if (!settings) return;

    document.getElementById("darkMode").checked = settings.darkMode;
    document.getElementById("notifications").checked = settings.notifications;

}

function saveSettings() {

    const settings = {

        darkMode: document.getElementById("darkMode").checked,

        notifications: document.getElementById("notifications").checked

    };

    localStorage.setItem("nexaSettings", JSON.stringify(settings));

    alert("Settings saved successfully!");

}
