loadWhoToFollow();


let timeout;
document.getElementById("search-users").addEventListener("input", async (e) => {
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    const query = e.target.value.trim().toLowerCase();
    const userList = document.getElementById("rbar")
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
            const li = document.createElement("li");
            li.classList.add("user-item");
            li.dataset.username = user.name;
            li.dataset.handle = `@${user.username}`;
            li.innerHTML = `
              <a href="/profile.html?username=${user.username}">
                <img src="${user.avatar?.url || '/img/png/user.png'}" alt="User avatar" class="avatar-bounce user-avatar other-avatar">
                <div class="user-info">
                  <div class="username">${user.name}</div>
                  <div class="handle">@${user.username}</div>
                </div>
              </a>
            `;
            searchResults.appendChild(li);
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