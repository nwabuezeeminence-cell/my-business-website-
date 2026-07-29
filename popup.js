function showPopup(title,message,icon="✓"){

    document.getElementById("popupTitle").textContent=title;

    document.getElementById("popupMessage").textContent=message;

    document.getElementById("popupIcon").textContent=icon;

    document
    .getElementById("popupOverlay")
    .classList
    .add("active");

}

document
.getElementById("popupButton")
.onclick=function(){

    document
    .getElementById("popupOverlay")
    .classList
    .remove("active");

}