const emojiBtn = document.getElementById("emojiBtn");
const emojiPanel = document.getElementById("emojiPanel");
const input = document.getElementById("messageInput");

emojiBtn.onclick = () => {
    emojiPanel.classList.toggle("active");
};

document.querySelectorAll(".emoji-panel span").forEach(emoji => {
    emoji.onclick = () => {
        input.value += emoji.textContent;
        input.focus();
    };
});