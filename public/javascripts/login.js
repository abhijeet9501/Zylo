const baseUrl = '/api/v1/auth';

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateUsername = (username) => {
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
};

const login = async () => {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    return showPopUp("All fields required!", true);
  }

  if (password.length < 6) {
    return showPopUp("Password must be 6+ characters!", true);
  }

  showLoading();

  try {
    const response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });

    if (!response.ok) {
      hideLoading();
      return showPopUp("Login failed! Server error.", true);
    }

    const data = await response.json();

    if (data.success) {
      playSound("./wav/lv.wav");
      showPopUp("LOGIN WIN!", false, "/index.html");
    } else {
      hideLoading();
      showPopUp(data.message || "Invalid credentials!", true);
    }
  } catch (error) {
    hideLoading();
    showPopUp("Invalid credentials!", true);
  }
};

const register = async () => {
  const username = document.getElementById("reg-username").value.trim();
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();

  if (!username || !password || !name || !email) {
    return showPopUp("All fields required!", true);
  }

  if (!validateUsername(username)) {
    return showPopUp("Username must be 3-20 characters, letters, numbers, or underscores!", true);
  }

  if (!validateEmail(email)) {
    return showPopUp("Invalid email format!", true);
  }

  if (password.length < 6) {
    return showPopUp("Password must be 6+ characters!", true);
  }

  showLoading();

  try {
    const response = await fetch(`${baseUrl}/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        name: name,
        email: email,
        password: password,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      hideLoading();
      return showPopUp(data.message, true);
    }


    if (data.success) {
      showPopUp("REGISTER WIN!", false, "/login.html");
    } else {
      hideLoading();
      showPopUp(data.message || "Registration failed!", true);
    }
  } catch (error) {
    hideLoading();
    showPopUp("Network error! Try again.", true);
  }
};

const loginBtn = document.getElementById("login-submit");
const regBtn = document.getElementById("reg-submit");

loginBtn.addEventListener("click", () => {
  login();
});

regBtn.addEventListener("click", () => {
  register();
});


const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toRegister = document.getElementById('to-register');
const toLogin = document.getElementById('to-login');

toRegister.addEventListener('click', () => {
  loginForm.classList.remove('active');
  registerForm.classList.add('active');
  document.getElementById('reg-username').focus();
});

toLogin.addEventListener('click', () => {
  registerForm.classList.remove('active');
  loginForm.classList.add('active');
  document.getElementById('login-username').focus();
});