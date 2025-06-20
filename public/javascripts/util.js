const profile_url = "/api/v1/profile";

let localUser = JSON.parse(sessionStorage.getItem("user")) || null;
let timeoutId;


const showPopUp = (message, isError, isRedirect = null) => {
  if (timeoutId) clearTimeout(timeoutId);

  let element = isError ? document.getElementById("error-msg") : document.getElementById("success-msg");

  element.textContent = isError ? `Error: ${message}` : `Success: ${message}`;
  element.style.display = "block";
  timeoutId = setTimeout(() => {
    element.style.display = "none";
    if (isRedirect) window.location.href = isRedirect;
  }, 1000);
};


const saveToLocal = (key, value) => {
  const existing = JSON.parse(sessionStorage.getItem(key)) || {};
  const updated = { ...existing, ...value };
  sessionStorage.setItem(key, JSON.stringify(updated));
};


const playSound = (soundUrl) => {
  const isMuted = localStorage.getItem('mute') || null;
  if(isMuted === 'true') return;
  const audio = new Audio(soundUrl);
  audio.volume = 0.3;
  audio.play().catch(e => console.log('Audio play failed:', e));
};


const showLoading = () => {
  const loader = document.getElementById('loading-screen');
  loader.classList.add('show');
  playSound('https://www.myinstants.com/media/sounds/sci-fi-blip.mp3');
  generateDigitalRain();
};


const hideLoading = () => {
  const loader = document.getElementById('loading-screen');
  loader.classList.remove('show');
  const rain = document.querySelector('.digital-rain');
  rain.innerHTML = ''; 
};


const generateDigitalRain = () => {
  const rain = document.querySelector('.digital-rain');
  rain.innerHTML = ''; 
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


const renderUser = async () => {
  localUser = JSON.parse(sessionStorage.getItem("user")) || null;

  if (!localUser || !localUser.username) {
    try {
      const response = await fetch(`${profile_url}/basic`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        sessionStorage.removeItem("user"); 
        window.location.href = "/login.html";
        return;
      }

      const data = await response.json();

      if (data.success) {
        const userData = data.user;
        saveToLocal("user", { 
          name: userData.name, 
          username: userData.username, 
          avatar: userData.avatar.url, 
          bio: userData.bio,
          email: userData.email 
        });
        localUser = JSON.parse(sessionStorage.getItem("user"));
      } else {
        sessionStorage.removeItem("user");
        window.location.href = "/login.html";
        return;
      }
    } catch (error) {
      console.log(error);
      sessionStorage.removeItem("user");
      window.location.href = "/login.html";
      return;
    }
  }
  renderData(localUser);
};

function renderData(user) {
  const name = user.name;
  const username = user.username;
  const avatar = user?.avatar || null;

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