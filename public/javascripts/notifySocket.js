const notifySocket = io("/notify", {
      withCredentials: true,
    });
    notifySocket.on("notify", () => {
        const alertsLink = document.querySelector(".notifications-btn");
        alertsLink.classList.add("has-notification");
    });
    notifySocket.on("notify-chat", () => {
        const messagesLink = document.getElementById('msg-btn');
        messagesLink.classList.add("has-notification");
    });