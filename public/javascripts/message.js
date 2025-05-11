// message.js
renderUser(false);

const chatSocket = io("/chat", {
  withCredentials: true,
});

let currentRoomId = null;


const loadChats = async () => {
    try {
        const res = await fetch("/api/v1/chat/getchat", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await res.json();
   
        const rooms = data.rooms;
        if (res.ok) {
            const userList = document.querySelector(".user-list");
            userList.innerHTML = "";
            rooms.forEach((room) => {
                const user = room.users[0];
                const li = document.createElement("li");
                li.classList.add("user-item");
                li.dataset.username = user.name;
                li.dataset.handle = `@${user.username}`;
                li.dataset.roomId = room._id; 
                li.innerHTML = `
            <img src="${user.avatar?.url || '/img/png/user.png'}" alt="User avatar" class="avatar-bounce user-avatar other-avatar">
            <div class="user-info">
              <div class="username">${user.name}</div>
              <div class="handle">@${user.username}</div>
            </div>
          `;
                userList.appendChild(li);
            }
            );

            document.querySelectorAll(".user-item").forEach((item) => {
            item.addEventListener("click", () => {
            const username = item.dataset.handle.slice(1); 
            currentRoomId = item.dataset.roomId;
            loadChat(username);
        });
      });
        }
    } catch (err) {
        console.log(err);
    }
};

const loadChat = async (username) => {
  const chatPanel = document.querySelector("#chat-desktop");
  const headerUsername = chatPanel.querySelector(".chat-header .username");
  const headerHandle = chatPanel.querySelector(".chat-header .handle");
  const messagesContainer = chatPanel.querySelector(".chat-messages");
  const avatar = chatPanel.querySelector(".chat-header .user-avatar");

  try {
    const res = await fetch("/api/v1/chat/loadchat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();

    if (res.ok) {
   
      headerUsername.textContent = data.userToAdd.name;
      headerHandle.textContent = `@${data.userToAdd.username}`;
      avatar.src = data.userToAdd.avatar?.url || "/img/png/user.png";

      messagesContainer.innerHTML = "";
      data.messages.forEach((msg) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add(
          "message",
          msg.user_id.toString() === data.myId ? "sent" : "received"
        );
        messageDiv.textContent = msg.message;
        messagesContainer.appendChild(messageDiv);
      });
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      chatSocket.emit("join-room", (currentRoomId));
    }
  } catch (err) {
    console.log(err);
  }
};

document.querySelector("#chat-desktop .send-btn").addEventListener("click", () => {
  const input = document.querySelector("#message-input-desktop");
  const messageText = input.value.trim();
  if (messageText && currentRoomId) {
    const messagesContainer = document.querySelector("#chat-desktop .chat-messages");
    
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "sent");
    messageDiv.textContent = messageText;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    chatSocket.emit("send-msg", {
      roomId: currentRoomId,
      message: messageText,
    });
    input.value = "";
  }
});

chatSocket.on("receive-msg", (message) => {
  const messagesContainer = document.querySelector("#chat-desktop .chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "received");
  messageDiv.textContent = message;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

document.getElementById("search-users").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll(".user-item").forEach((item) => {
        const username = item.dataset.username.toLowerCase();
        const handle = item.dataset.handle.toLowerCase();
        item.style.display = username.includes(query) || handle.includes(query) ? "flex" : "none";
    });
});

loadChats();