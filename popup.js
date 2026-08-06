function showPopup(title, message, icon="✓"){
    const overlay = document.getElementById("popupOverlay");
    const titleEl = document.getElementById("popupTitle");
    const msgEl = document.getElementById("popupMessage");
    const iconEl = document.getElementById("popupIcon");
    const btn = document.getElementById("popupBtn");

    // Only run if popup exists on this page
    if(!overlay || !titleEl || !msgEl || !iconEl) return;

    titleEl.textContent = title;
    msgEl.textContent = message;
    iconEl.textContent = icon;
    overlay.classList.add("active");

    // Close button
    if(btn){
        btn.onclick = function(){
            overlay.classList.remove("active");
        }
    }

    // Auto close after 2 seconds
    setTimeout(() => {
        overlay.classList.remove("active");
    }, 2000);
}

// Close when you click outside
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("popupOverlay");
    if(overlay){
        overlay.addEventListener("click", (e) => {
            if(e.target.id === "popupOverlay"){
                overlay.classList.remove("active");
            }
        });
    } // <-- YOU WERE MISSING THIS }
}); // <-- AND THIS });