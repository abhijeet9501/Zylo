document.addEventListener("DOMContentLoaded", async () => {
    await loadNotifications();
    await renderUser();
    if (window.innerWidth > 768) {
        await loadWhoToFollow();
    }
});

const loadNotifications = async () => {
    const list = document.querySelector(".notification-list");

    const data = await fetchAPI("/notify/getnotify");

    if (data.success) {
        data.data.forEach((user) => {
            const item = document.createElement("div");
            item.setAttribute("class", "notification-item notification-appear");
    
            item.innerHTML = `
                <img src=${user.avatar || '/img/png/user.png'} alt="User avatar" class="avatar-bounce other-avatar">
                <div class="notification-content">
                  <div class="notification-text">
                    <span class="username">${user.username}</span> ${user.message}
                  </div>
                  <div class="timestamp">${`· ${user.timeAgo}`}</div>
                </div>
            `;
            list.appendChild(item);
        });
    }
};
