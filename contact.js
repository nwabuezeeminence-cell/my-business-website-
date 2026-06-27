// contact.js

emailjs.init({
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY"
});

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        alert("Contact form connected successfully. EmailJS will be configured in the next stage.");

        form.reset();
    });

});