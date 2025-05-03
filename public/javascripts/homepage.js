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

// Tweet Submission
const tweetForm = document.querySelector('.tweet-box');
const tweetInput = document.querySelector('.tweet-input');
const tweetCounter = document.querySelector('.tweet-counter');
const tweetsList = document.querySelector('.tweets-list');

tweetInput.addEventListener('input', () => {
  tweetCounter.textContent = 80 - tweetInput.value.length;
});

tweetForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = tweetInput.value.trim();
  if (!text) return;

  const currentUser = {
    name: 'John Smith',
    username: 'john_smith',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
  };

  const tweetEl = document.createElement('article');
  tweetEl.classList.add('tweet');
  tweetEl.setAttribute('role', 'article');
  tweetEl.setAttribute('aria-label', `Tweet by ${currentUser.name}`);
  tweetEl.innerHTML = `
    <header class="tweet-header">
      <img src="${currentUser.avatar}" alt="${currentUser.name}'s avatar" class="avatar" />
      <div>
        <span class="name">${currentUser.name}</span>
        <span class="username">@${currentUser.username}</span>
      </div>
    </header>
    <p class="tweet-content">${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
    <div class="tweet-actions">
      <button aria-pressed="false" aria-label="Like this tweet">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.45 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.44C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.45 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        0
      </button>
      <button aria-label="Comment on this tweet">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/>
        </svg>
        0
      </button>
    </div>
  `;
  tweetsList.prepend(tweetEl);
  tweetInput.value = '';
  tweetCounter.textContent = '280';
  tweetInput.focus();
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

        const userData = { name, username, avatar, bio };
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

