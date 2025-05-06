renderUser();

const inputName = document.getElementById("name");
const inputUsername = document.getElementById("username");
const inputEmail = document.getElementById("email");
const inputBio = document.getElementById("bio");
const inputAvatar = document.getElementById("upload-avatar");


inputName.setAttribute("placeholder", localUser.name);
inputUsername.setAttribute("placeholder", localUser.username);
inputBio.setAttribute("placeholder", localUser?.bio || "");
inputEmail.setAttribute("placeholder", localUser?.Email || "");

const accBtn = document.getElementById("acc-btn");
const accBtnMobile = document.getElementById("mobile-update-btn");

const updateAccInfo = async (type) => {
    const inputName = document.getElementById(type==="pc" ? "name" : "name-mobile");
    const inputUsername = document.getElementById(type==="pc" ? "username" : "username-mobile");
    const inputEmail = document.getElementById(type==="pc" ? "email" : "email-mobile");
    const inputBio = document.getElementById(type==="pc" ? "bio" : "bio-mobile");
    const inputAvatar = document.getElementById(type==="pc" ? "avatar-upload" : "avatar-upload-mobile");


    inputName.setAttribute("placeholder", localUser.name);
    inputUsername.setAttribute("placeholder", localUser.username);
    inputBio.setAttribute("placeholder", localUser?.bio || "");
    inputEmail.setAttribute("placeholder", localUser?.Email || "");

    if (inputAvatar.files.length > 0) {
        const file = inputAvatar.files[0];
        updateAvatar(file);
    };

    const updateData = {};

    if (inputName.value != "") updateData.name = inputName.value;
    if (inputUsername.value != "") updateData.username = inputUsername.value;
    if (inputEmail.value != "") updateData.email = inputEmail.value;
    if (inputBio.value != "") updateData.bio = inputBio.value;

    if (Object.keys(updateData).length > 0) {

        const response = await fetch("/api/v1/profile/update", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) { };

        const data = await response.json();

        if (data.success) {
            showPopUp("Updated!", false);
            const updates = data.user;
            updates.avatar = data.avatar;
            saveToLocal("user", updates);
        } else {
            showPopUp(data.message, true);
        };
    };
};

const updateAvatar = async (file) => {

    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch("/api/v1/profile/avatar", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) { };

    const data = await response.json();

    if (data.success) {
        saveToLocal("user", { avatar: data.url });
        showPopUp("Updated Avatar!", false);
    }
};

accBtn.addEventListener("click", () => {
    updateAccInfo("pc");
});

accBtnMobile.addEventListener("click", () => {
    updateAccInfo("mobile");
});

const updatePassword = async (type) => {
    const currentPass = document.getElementById(type==="pc" ? "current-password": "current-password-mobile");
    const newPass = document.getElementById(type==="pc" ? "new-password": "new-password-mobile");

    if (currentPass.value == "" || newPass.value == "") return showPopUp("Require all fields!", true);

    const currentPassword = currentPass.value;
    const newPassword = newPass.value;

    const response = await fetch ("/api/v1/profile/password", {
        method: "PUT", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({currentPassword, newPassword}),
    });

    if (!response.ok) {};

    const data = await response.json();

    if (data.success) {
        showPopUp("Password Updated!", false);
    }
    else {
        showPopUp(data.message, true);
    };
};

const pcPassBtn = document.getElementById("update-pass-pc");
const mobilePassBtn = document.getElementById("update-pass-mobile");

pcPassBtn.addEventListener("click", () => {
    updatePassword("pc");
});

mobilePassBtn.addEventListener("click", () => {
    updatePassword("mobile");
});