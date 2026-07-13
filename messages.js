function renderMessage(msg) {
    const bubble = document.createElement("div");

    bubble.className =
        msg.sender === currentUser.uid
            ? "my-message"
            : "their-message";

    let content = "";

    switch (msg.type) {
        case "text":
            content = `<p>${msg.text}</p>`;
            break;

        case "image":
            content = `
                <img src="${msg.fileUrl}" class="chat-image">
                <p>${msg.text || ""}</p>
            `;
            break;

        case "audio":
            content = `
                <audio controls src="${msg.fileUrl}"></audio>
            `;
            break;

        default:
            content = `<p>${msg.text}</p>`;
    }

    bubble.innerHTML = `
        ${content}
        <div class="message-footer">
            <small>
                ${new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })}
            </small>
        </div>
    `;

    return bubble;
}