const profile_url = "/api/v1/profile";

let localUser = JSON.parse(sessionStorage.getItem("user")) || null;
let timeoutId;

// Show popup message (success or error)
const showPopUp = (message, isError, isRedirect = null) => {
  if (timeoutId) clearTimeout(timeoutId);

  let element = isError ? document.getElementById("error-msg") : document.getElementById("success-msg");

  element.textContent = isError ? `Error: ${message}` : `Success: ${message}`;
  element.style.display = "block";
  timeoutId = setTimeout(() => {
    element.style.display = "none";
    if (isRedirect) window.location.href = isRedirect;
  }, 2000);
};

// Save to sessionStorage (instead of localStorage)
const saveToLocal = (key, value) => {
  const existing = JSON.parse(sessionStorage.getItem(key)) || {};
  const updated = { ...existing, ...value };
  sessionStorage.setItem(key, JSON.stringify(updated));
};

// Play sound (centralized)
const playSound = (soundUrl) => {
  const audio = new Audio(soundUrl);
  audio.volume = 0.3;
  audio.play().catch(e => console.log('Audio play failed:', e));
};

// Show loading screen with digital rain
const showLoading = () => {
  const loader = document.getElementById('loading-screen');
  loader.classList.add('show');
  playSound('https://www.myinstants.com/media/sounds/sci-fi-blip.mp3');
  generateDigitalRain();
};

// Hide loading screen
const hideLoading = () => {
  const loader = document.getElementById('loading-screen');
  loader.classList.remove('show');
  const rain = document.querySelector('.digital-rain');
  rain.innerHTML = ''; // Clear digital rain when hiding
};

// Generate digital rain effect for loading screen
const generateDigitalRain = () => {
  const rain = document.querySelector('.digital-rain');
  rain.innerHTML = ''; // Clear previous rain
  const characters = '01ABCDEF';
  for (let i = 0; i < 50; i++) {
    const char = document.createElement('span');
    char.className = 'rain-char';
    char.textContent = characters[Math.floor(Math.random() * characters.length)];
    char.style.left = `${Math.random() * 100}%`;
    char.style.animationDelay = `${Math.random() * 5}s`;
    rain.appendChild(char);
  }
};

// Render user data (fetches from server if sessionStorage is empty)
const renderUser = async (isBio = false) => {
  // Check if user data exists in sessionStorage
  localUser = JSON.parse(sessionStorage.getItem("user")) || null;

  if (!localUser || !localUser.username) {
    try {
      showLoading(); // Show loading while fetching

      const timeout = setTimeout(() => {
        hideLoading();
        showPopUp("Request timed out! Please try again.", true);
        window.location.href = "/login.html";
      }, 10000); // 10 seconds timeout

      const response = await fetch(`${profile_url}/me`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      });

      clearTimeout(timeout);
      hideLoading();

      if (!response.ok) {
        sessionStorage.removeItem("user"); // Clear sessionStorage on failure
        window.location.href = "/login.html";
        return;
      }

      const data = await response.json();

      if (data.success) {
        const userData = data.data;
        saveToLocal("user", { 
          name: userData.name, 
          username: userData.username, 
          avatar: userData.avatar.url, 
          bio: userData.bio,
          email: userData.email // Include email for settings page
        });
        localUser = JSON.parse(sessionStorage.getItem("user"));
      } else {
        sessionStorage.removeItem("user");
        window.location.href = "/login.html";
        return;
      }
    } catch (error) {
      hideLoading();
      sessionStorage.removeItem("user");
      showPopUp("Network error! Redirecting to login.", true);
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
};


const searchUsername = document?.getElementById("search-username");

if (searchUsername) {
  searchUsername.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const value = searchUsername.value.trim();
        
        if (value == "") {return};
        redirect(value); 
      }
  });
  
  const redirect = (username) => {
      const URL = `/user-profile.html?username=${username}`;
  
      window.location.href = URL;
  };
};