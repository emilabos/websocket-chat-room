const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
let username;

function addMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.className = "message";
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getCookie(cookiename) {
  const cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
  return decodeURIComponent(
    cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
  );
}

function addCookie(cookie) {
  document.cookie += cookie;
}

function eraseCookie(cookie) {
  document.cookie = cookie + "=; Max-Age=0";
}

sendBtn.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("chat message", message);
    messageInput.value = "";
  }
});

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

socket.on("chat message", (msg) => {
  addMessage(msg);
});

window.onload = () => {
  if (!getCookie("username")) {
    while (!username) {
      username = prompt("Username: ");
    }
    addCookie(`username=${username};`);
  } else {
    username = getCookie("username");
  }

  const socket = io();
  socket.emit("set-user", username);
};
