const baseUrl = '/api/v1/auth'

const login = async () => {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (!username || !password) {
        return showPopUp("LOGIN ERROR! All credentials required", true);
    };

    const response = await fetch (`${baseUrl}/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    });

    if (!response.ok) return showPopUp("Error!", true);

    const data = await response.json();


    if (data.success)
    {
        saveToLocal("user", {name: data.name, username: data.username, avatar: data.avatar.url});
        showPopUp("LOGIN WIN!", false, "/index.html");
    } else {
        showPopUp(data.message, true);
    }
};

const register = async () => {
    const username = document.getElementById("reg-username").value;
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    if (!username || !password || !name || !email) {
        return showPopUp("REGISTER ERROR! All credentials required", true);
    };

    const response = await fetch (`${baseUrl}/register`, {
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

    if (!response.ok) return showPopUp("Error!", true);

    const data = await response.json();

    if (data.success) {
        showPopUp("REGISTER WIN!", false, "/login.html");
    }
    else {
        showPopUp(data.message, true);
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