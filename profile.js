// profile.js

document.addEventListener("DOMContentLoaded", loadProfile);

function loadProfile() {

    const profile = JSON.parse(localStorage.getItem("nexaProfile"));

    if (profile) {

        document.getElementById("profileName").textContent = profile.name;
        document.getElementById("profileEmail").textContent = profile.email;
        document.getElementById("fullName").value = profile.name;
        document.getElementById("bio").value = profile.bio;

    } else {

        document.getElementById("fullName").value = "";
        document.getElementById("bio").value = "";

    }

}

function saveProfile() {

    const profile = {

        name: document.getElementById("fullName").value.trim() || "Guest User",

        email: document.getElementById("profileEmail").textContent,

        bio: document.getElementById("bio").value.trim()

    };

    localStorage.setItem("nexaProfile", JSON.stringify(profile));

    document.getElementById("profileName").textContent = profile.name;

    alert("Profile saved successfully!");

}