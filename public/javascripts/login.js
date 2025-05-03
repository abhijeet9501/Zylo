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
            showPopUp(data.message);
            window.location.href='/index.html';
        }
        else {
            showPopUp(data.message);
        }
    })
    .catch(error => {
        showPopUp('Network error, try again');
    });
});



const registerBtn = document.getElementById("register-submit-btn");

registerBtn.addEventListener("click", async () => {
    const regUsername = document.getElementById("reg-username");
    const regName = document.getElementById("reg-name");
    const regEmail = document.getElementById("reg-email");
    const regPassword = document.getElementById("reg-password");

    if (!regUsername.value || !regName.value || !regEmail.value || !regPassword.value) showPopUp("All fields are required!");

    const regData = {
        username: regUsername.value,
        name: regName.value,
        email: regEmail.value,
        password: regPassword.value,
    }


    const response = await fetch (`${baseUrl}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        credentials: "include", 
        body: JSON.stringify(regData),
    });

    const data = await response.json();
    console.log(data);
    updateLocalStorageObject("user", {
        name: data.name,
        username: data.name,
        avatar: data.avatar,
    });

    showPopUp(data.message);
    setTimeout(() => {
        window.location.reload();
    }, 500);
});


