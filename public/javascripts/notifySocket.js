const notifySocket = io("/notify", {
      withCredentials: true,
    });
    notifySocket.on("notify", () => {
        const alertsLinks = document.querySelectorAll(".notifications-btn");
        alertsLinks.forEach(alertsLink => {
            alertsLink.classList.add("has-notification");
        });
    });
    notifySocket.on("notify-chat", () => {
        const messagesLinks = document.querySelectorAll('.msg-btn');
        messagesLinks.forEach(messagesLink => {
            messagesLink.classList.add("has-notification");
        });
    });
