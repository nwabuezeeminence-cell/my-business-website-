// groups.js

const groups = [];

function createGroup() {

    const input = document.getElementById("groupName");

    const name = input.value.trim();

    if (name === "") {
        alert("Please enter a group name.");
        return;
    }

    groups.push(name);

    input.value = "";

    displayGroups();

}

function displayGroups() {

    const list = document.getElementById("groupList");

    list.innerHTML = "";

    if (groups.length === 0) {

        list.innerHTML = "<p>No groups created yet.</p>";

        return;

    }

    groups.forEach((group, index) => {

        const card = document.createElement("div");

        card.className = "user-card";

        card.innerHTML = `
            <h3>${group}</h3>
            <button onclick="joinGroup(${index})">
                Join Group
            </button>
        `;

        list.appendChild(card);

    });

}

function joinGroup(index) {

    alert("You joined " + groups[index]);

}

document.addEventListener("DOMContentLoaded", () => {

    displayGroups();

});