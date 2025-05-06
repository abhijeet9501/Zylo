const profile_url = "/api/v1/profile";

let localUser = JSON.parse(localStorage.getItem("user")) || null;
let timeoutId;

const showPopUp = (message, isError, isRedirect = null) => {
  if (timeoutId) clearTimeout(timeoutId);

  let element = isError ? document.getElementById("error-msg") : document.getElementById("success-msg");

  element.textContent = message;
  element.style.display = "block";

  timeoutId = setTimeout(() => {
    element.style.display = "none";
    if (isRedirect) window.location.href = isRedirect;
  }, 2000);
};

const saveToLocal = (key, value) => {
  const existing = JSON.parse(localStorage.getItem(key)) || {};
  const updated = { ...existing, ...value };
  localStorage.setItem(key, JSON.stringify(updated));
};

const renderUser = async (isBio = false) => {
  if (!localUser || !localUser.username) {
    try {
      const response = await fetch(`${profile_url}/me`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        window.location.href = "/login.html";
        return;
      }

      const data = await response.json();

      if (data.success) {
        const userData = data.data;
        saveToLocal("user", { name: userData.name, username: userData.username, avatar: userData.avatar.url, bio: userData.bio });
        localUser = JSON.parse(localStorage.getItem("user"));
      } else {
        window.location.href = "/login.html";
        return;
      }
    } catch (error) {
      window.location.href = "/login.html";
      return;
    }
  }
  renderData(localUser, isBio);
};

function renderData(user, isBio) {
  const name = user.name;
  const username = user.username;
  const avatar = user?.avatar || null;
  if (isBio) {
    const bio = user?.bio || "";
    const userBio = document.getElementById("user-bio");
    if (userBio) userBio.textContent = bio;
  }

  const userUsername = document.getElementsByClassName("user-username");
  const userName = document.getElementsByClassName("user-name");
  const userAvatar = document.getElementsByClassName("loggedin-avatar");

  for (let el of userUsername) {
    el.textContent = `@${username}`;
  }

  for (let el of userName) {
    el.textContent = name;
  }

  if (avatar) {
    for (let img of userAvatar) {
      img.setAttribute("src", avatar);
    }
  }
}