// Initial render (using renderUser from util.js)
renderUser();

// Set placeholders using data from sessionStorage (via util.js)
const setPlaceholders = () => {
  const user = JSON.parse(sessionStorage.getItem('user')) || {};

  const inputName = document.getElementById("name");
  const inputUsername = document.getElementById("username");
  const inputEmail = document.getElementById("email");
  const inputBio = document.getElementById("bio");
  const inputNameMobile = document.getElementById("name-mobile");
  const inputUsernameMobile = document.getElementById("username-mobile");
  const inputEmailMobile = document.getElementById("email-mobile");
  const inputBioMobile = document.getElementById("bio-mobile");

  // Set placeholders for PC inputs
  inputName.setAttribute("placeholder", user.name || "Name");
  inputUsername.setAttribute("placeholder", user.username || "Username");
  inputBio.setAttribute("placeholder", user.bio || "Bio");
  inputEmail.setAttribute("placeholder", user.email || "Email");

  // Set placeholders for mobile inputs
  inputNameMobile.setAttribute("placeholder", user.name || "Name");
  inputUsernameMobile.setAttribute("placeholder", user.username || "Username");
  inputBioMobile.setAttribute("placeholder", user.bio || "Bio");
  inputEmailMobile.setAttribute("placeholder", user.email || "Email");
};

// Call setPlaceholders on page load
setPlaceholders();

// Update account info (PC and Mobile)
const updateAccInfo = async (type) => {
  const inputName = document.getElementById(type === "pc" ? "name" : "name-mobile");
  const inputUsername = document.getElementById(type === "pc" ? "username" : "username-mobile");
  const inputEmail = document.getElementById(type === "pc" ? "email" : "email-mobile");
  const inputBio = document.getElementById(type === "pc" ? "bio" : "bio-mobile");
  const inputAvatar = document.getElementById(type === "pc" ? "avatar-upload" : "avatar-upload-mobile");

  if (inputAvatar.files.length > 0) {
    const file = inputAvatar.files[0];
    await updateAvatar(file);
  }

  const updateData = {};

  if (inputName.value.trim() !== "") updateData.name = inputName.value.trim();
  if (inputUsername.value.trim() !== "") updateData.username = inputUsername.value.trim();
  if (inputEmail.value.trim() !== "") updateData.email = inputEmail.value.trim();
  if (inputBio.value.trim() !== "") updateData.bio = inputBio.value.trim();

  if (Object.keys(updateData).length > 0) {
    showLoading(); // From util.js

    try {
      const timeout = setTimeout(() => {
        hideLoading();
        showPopUp("Request timed out! Please try again.", true);
      }, 10000); // 10 seconds timeout

      const response = await fetch("/api/v1/profile/update", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData),
      });

      clearTimeout(timeout);
      hideLoading(); // From util.js

      if (!response.ok) {
        const errorData = await response.json();
        return showPopUp(errorData.message || "Failed to update profile! Server error.", true);
      }

      const data = await response.json();

      if (data.success) {
        const updates = data.user;
        updates.avatar = data.avatar || JSON.parse(sessionStorage.getItem('user')).avatar;
        saveToLocal("user", updates); // From util.js
        showPopUp("Profile updated successfully!", false); // From util.js
        // Refresh user data and DOM
        await renderUser(true); // From util.js
        setPlaceholders(); // Refresh placeholders
      } else {
        showPopUp(data.message || "Failed to update profile!", true);
      }
    } catch (error) {
      hideLoading();
      showPopUp("Network error! Please try again.", true);
    }
  }
};

// Update avatar
const updateAvatar = async (file) => {
  showLoading(); // From util.js

  try {
    const timeout = setTimeout(() => {
      hideLoading();
      showPopUp("Request timed out! Please try again.", true);
    }, 10000); // 10 seconds timeout

    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch("/api/v1/profile/avatar", {
      method: "POST",
      body: formData,
    });

    clearTimeout(timeout);
    hideLoading(); // From util.js

    if (!response.ok) {
      const errorData = await response.json();
      return showPopUp(errorData.message || "Failed to update avatar! Server error.", true);
    }

    const data = await response.json();

    if (data.success) {
      saveToLocal("user", { avatar: data.url }); // From util.js
      showPopUp("Avatar updated successfully!", false); // From util.js
      await renderUser(); // From util.js
    } else {
      showPopUp(data.message || "Failed to update avatar!", true);
    }
  } catch (error) {
    hideLoading();
    showPopUp("Network error! Please try again.", true);
  }
};

// Update password
const updatePassword = async (type) => {
  const currentPass = document.getElementById(type === "pc" ? "current-password" : "current-password-mobile");
  const newPass = document.getElementById(type === "pc" ? "new-password" : "new-password-mobile");

  if (currentPass.value.trim() === "" || newPass.value.trim() === "") {
    return showPopUp("Please fill in all fields!", true);
  }

  const currentPassword = currentPass.value.trim();
  const newPassword = newPass.value.trim();

  showLoading(); // From util.js

  try {
    const timeout = setTimeout(() => {
      hideLoading();
      showPopUp("Request timed out! Please try again.", true);
    }, 10000); // 10 seconds timeout

    const response = await fetch("/api/v1/profile/password", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    clearTimeout(timeout);
    hideLoading(); // From util.js

    if (!response.ok) {
      const errorData = await response.json();
      return showPopUp(errorData.message || "Failed to update password! Server error.", true);
    }

    const data = await response.json();

    if (data.success) {
      showPopUp("Password updated successfully!", false);
    } else {
      showPopUp(data.message || "Failed to update password!", true);
    }
  } catch (error) {
    hideLoading();
    showPopUp("Network error! Please try again.", true);
  }
};

// Event listeners
const accBtn = document.getElementById("acc-btn");
const accBtnMobile = document.getElementById("mobile-update-btn");
const pcPassBtn = document.getElementById("update-pass-pc");
const mobilePassBtn = document.getElementById("update-pass-mobile");

accBtn.addEventListener("click", () => {
  updateAccInfo("pc");
});

accBtnMobile.addEventListener("click", () => {
  updateAccInfo("mobile");
});

pcPassBtn.addEventListener("click", () => {
  updatePassword("pc");
});

mobilePassBtn.addEventListener("click", () => {
  updatePassword("mobile");
});