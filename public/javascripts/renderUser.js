const baseUrl = "/api/v1/profile";

// User Dropdown Toggle
const userAvatar = document.querySelector('.user-avatar');
const userDropdown = document.querySelector('.user-dropdown');
userAvatar?.addEventListener('click', () => {
  userDropdown.classList.toggle('active');
});
document.addEventListener('click', e => {
  if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
    userDropdown.classList.remove('active');
  }
});


const userIcon = document.getElementById("user-icon");
const loginIcon = document.getElementById("login-icon");
const avatar = document.getElementById("profile-avatar");
const nameEl = document.getElementById("profile-name");
const usernameEl = document.getElementById("profile-username");

function renderUser(user) {
  if (user.avatar) avatar.src = user.avatar;
  nameEl.textContent = user.name || "";
  usernameEl.textContent = user.username || "";

  loginIcon.style.display = "none";
  userIcon.style.display = "block";
}

let user = JSON.parse(localStorage.getItem("user"));

if (user) {
  renderUser(user);
} else {
  fetch(`${baseUrl}/me`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data) {
        const { name, username, avatar = "", bio } = data.data;

        const userData = { name, username, avatar: avatar.url, bio };
        localStorage.setItem("user", JSON.stringify(userData));

        renderUser(userData);
      }
    })
    .catch(console.error); 
}


function logout() {
  localStorage.removeItem("user");
  
  fetch(`${baseUrl}/logout`, {
    method:"POST",
    credentials: "include",
  })
  .then(() => {
    window.location.href = "./index.html";
  })
  .catch((err) => {
    console.error("Logout error", err);
    window.location.href = "./index.html";
  });
};