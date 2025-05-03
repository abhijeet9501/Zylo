const baseUrl = "/api/v1/auth";

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toRegister = document.getElementById('to-register');
const toLogin = document.getElementById('to-login');

function showLogin() {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
}

function showRegister() {
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
}

toRegister.addEventListener('click', showRegister);
toLogin.addEventListener('click', showLogin);


const loginBtn = document.getElementById("login-submit-btn");
const registerBtn = document.getElementById("register-submit-btn");

loginBtn.addEventListener("click", () => {
    const username = document.getElementById("login-username");
    const password = document.getElementById("login-password");
    
    if (!username.value || !password.value) {
        return showPopUp("Username and password required!");
    };

    fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    })
    .then (response => response.json())
    .then (data => {
        if (data.success) {
            localStorage.setItem("user", JSON.stringify({
                name: data.name,
                username: data.username,
                avatar: data.avatar,
            }));
            window.location.href='/index.html';
            showPopUp(data.message);
        }
        else {
            showPopUp(data.message);
        }
    })
    .catch(error => {
        showPopUp('Network error, try again');
    });
});