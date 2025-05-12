renderUser(false);
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    
    if (username) {
        if (window.innerWidth <= 768) {
            document.querySelector(".chats-list").style.display = "none";
            document.querySelector("#chat-mobile").style.display = "flex";
            await loadChat(username, "#chat-mobile");
          } else {
            await loadChat(username, "#chat-desktop");
          }
    };
    await loadChats();
});

const chatSocket = io("/chat", {
  withCredentials: true,
});

let currentRoomId = null;

const loadChats = async () => {
  try {
    const res = await fetch("/api/v1/chat/getchat", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
      });

      document.querySelectorAll(".user-item").forEach((item) => {
        item.addEventListener("click", () => {
          const username = item.dataset.handle.slice(1);
          currentRoomId = item.dataset.roomId;
          if (window.innerWidth <= 768) {
            document.querySelector(".chats-list").style.display = "none";
            document.querySelector("#chat-mobile").style.display = "flex";
            loadChat(username, "#chat-mobile");
          } else {
            loadChat(username, "#chat-desktop");
          }
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const loadChat = async (username, targetPanel) => {
  const chatPanel = document.querySelector(targetPanel);
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
      currentRoomId = data.room_id;
      chatSocket.emit("join-room", currentRoomId);
    }
  } catch (err) {
    console.log(err);
  }
};


document.querySelectorAll(".send-btn").forEach((button) => {
    button.addEventListener("click", () => {
    const input = button.previousElementSibling; // #message-input-desktop or #message-input-mobile
    const messageText = input.value.trim();
    console.log(messageText, currentRoomId);
    if (messageText && currentRoomId) {
      const messagesContainer = button.closest(".chat-panel").querySelector(".chat-messages");
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
});


chatSocket.on("receive-msg", (message) => {
  const panels = ["#chat-desktop", "#chat-mobile"];
  panels.forEach((panel) => {
    const chatPanel = document.querySelector(panel);
    if (chatPanel.style.display !== "none") {
      const messagesContainer = chatPanel.querySelector(".chat-messages");
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", "received");
      messageDiv.textContent = message;
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });
});


document.querySelector(".back-btn").addEventListener("click", () => {
  document.querySelector("#chat-mobile").style.display = "none";
  document.querySelector(".chats-list").style.display = "block";
});

// document.getElementById("search-users").addEventListener("input", (e) => {
//   const query = e.target.value.toLowerCase();
//   document.querySelectorAll(".user-item").forEach((item) => {
//     const username = item.dataset.username.toLowerCase();
//     const handle = item.dataset.handle.toLowerCase();
//     item.style.display = username.includes(query) || handle.includes(query) ? "flex" : "none";
//   });
// });


let timeout;
document.getElementById("search-users").addEventListener("input", async (e) => {
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    const query = e.target.value.trim().toLowerCase();
    const userList = document.querySelector(".user-list");
    const searchResults = document.querySelector(".search-results");

    if (query) {
      try {
        const res = await fetch(`/api/v1/profile/searchuser?q=${encodeURIComponent(query)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        const users = data.users;

        if (res.ok) {
          userList.style.display = "none";
          searchResults.style.display = "block";
          if (users.length < 1) {
            searchResults.innerHTML = "No user Found";
            return;
          };
          searchResults.innerHTML = "";
          users.forEach((user) => {
            console.log(user);
            const li = document.createElement("li");
            li.classList.add("user-item");
            li.dataset.username = user.name;
            li.dataset.handle = `@${user.username}`;
            li.innerHTML = `
              <a href="javascript:void(0)" onclick="loadChat('${user.username}', window.innerWidth <= 768 ? '#chat-mobile' : '#chat-desktop')">
                <img src="${user.avatar?.url || '/img/png/user.png'}" alt="User avatar" class="avatar-bounce user-avatar other-avatar">
                <div class="user-info">
                  <div class="username">${user.name}</div>
                  <div class="handle">@${user.username}</div>
                </div>
              </a>
            `;
            searchResults.appendChild(li);
          });

          document.querySelectorAll(".search-results .user-item a").forEach((link) => {
            link.addEventListener("click", () => {
              if (window.innerWidth <= 768) {
                document.querySelector(".chats-list").style.display = "none";
                document.querySelector("#chat-mobile").style.display = "flex";
              }
            });
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      userList.style.display = "block";
      searchResults.style.display = "none";
      searchResults.innerHTML = "";
    }
  }, 500);
});
