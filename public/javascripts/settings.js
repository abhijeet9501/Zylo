document.addEventListener("DOMContentLoaded", async () => {
  await renderUser();
  setPlaceholders();
});


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

  inputName.setAttribute("placeholder", user.name || "Name");
  inputUsername.setAttribute("placeholder", user.username || "Username");
  inputBio.setAttribute("placeholder", user.bio || "Bio");
  inputEmail.setAttribute("placeholder", user.email || "Email");

  inputNameMobile.setAttribute("placeholder", user.name || "Name");
  inputUsernameMobile.setAttribute("placeholder", user.username || "Username");
  inputBioMobile.setAttribute("placeholder", user.bio || "Bio");
  inputEmailMobile.setAttribute("placeholder", user.email || "Email");
};

setPlaceholders();

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
    showLoading();

    try {
      const timeout = setTimeout(() => {
        hideLoading();
        showPopUp("Request timed out! Please try again.", true);
      }, 10000);

      const response = await fetch("/api/v1/profile/update", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData),
      });

      clearTimeout(timeout);
      hideLoading();

      if (!response.ok) {
        const errorData = await response.json();
        return showPopUp(errorData.message || "Failed to update profile! Server error.", true);
      }

      const data = await response.json();

      if (data.success) {
        const updates = data.user;
        updates.avatar = data.avatar || JSON.parse(sessionStorage.getItem('user')).avatar;
        saveToLocal("user", updates);
        showPopUp("Profile updated successfully!", false);
        await renderUser();
        setPlaceholders();
      } else {
        showPopUp(data.message || "Failed to update profile!", true);
      }
    } catch (error) {
      hideLoading();
      showPopUp("Network error! Please try again.", true);
    }
  }
};

const updateAvatar = async (file) => {
  showLoading();

  try {
    const timeout = setTimeout(() => {
      hideLoading();
      showPopUp("Request timed out! Please try again.", true);
    }, 10000);

    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch("/api/v1/profile/avatar", {
      method: "POST",
      body: formData,
    });

    clearTimeout(timeout);
    hideLoading();

    if (!response.ok) {
      const errorData = await response.json();
      return showPopUp(errorData.message || "Failed to update avatar! Server error.", true);
    }

    const data = await response.json();

    if (data.success) {
      saveToLocal("user", { avatar: data.url });
      showPopUp("Avatar updated successfully!", false);
      await renderUser();
    } else {
      showPopUp(data.message || "Failed to update avatar!", true);
    }
  } catch (error) {
    hideLoading();
    showPopUp("Network error! Please try again.", true);
  }
};

const updatePassword = async (type) => {
  const currentPass = document.getElementById(type === "pc" ? "current-password" : "current-password-mobile");
  const newPass = document.getElementById(type === "pc" ? "new-password" : "new-password-mobile");

  if (currentPass.value.trim() === "" || newPass.value.trim() === "") {
    return showPopUp("Please fill in all fields!", true);
  }

  const currentPassword = currentPass.value.trim();
  const newPassword = newPass.value.trim();

  showLoading();

  try {
    const timeout = setTimeout(() => {
      hideLoading();
      showPopUp("Request timed out! Please try again.", true);
    }, 10000); 10

    const response = await fetch("/api/v1/profile/password", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    clearTimeout(timeout);
    hideLoading();

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


document.querySelectorAll('.back-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.mobile-panel').forEach(panel => panel.style.display = 'none');
    document.querySelector('.settings-menu').style.display = 'block';
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    playSound('https://res.cloudinary.com/dufkkffxd/video/upload/v1746420154/coin_j82rku.wav');
  });
});


document.querySelectorAll('.menu-btn').forEach(button => {
  button.addEventListener('click', () => {

    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    playSound('https://res.cloudinary.com/dufkkffxd/video/upload/v1746420154/coin_j82rku.wav'); // select-sound

    document.querySelectorAll('.right-sidebar .settings-panel').forEach(panel => panel.style.display = 'none');
    const desktopTarget = document.getElementById(button.dataset.target);
    desktopTarget.style.display = 'block';

    if (window.innerWidth <= 768) {
      document.querySelectorAll('.settings-menu, .mobile-panel').forEach(panel => panel.style.display = 'none');
      const mobileTarget = document.getElementById(button.dataset.target + '-mobile');
      mobileTarget.style.display = 'block';
    }
  });
});


const muteToggle = document.getElementById('mute-toggle');
const muteToggleMobile = document.getElementById('mute-toggle-mobile');
const toggleLabel = document.querySelector('#mute .toggle-label');
const toggleLabelMobile = document.querySelector('#mute-mobile .toggle-label');
const syncToggles = (source, target, labelSource, labelTarget) => {
  target.checked = source.checked;
  labelSource.textContent = source.checked ? 'OFF' : 'ON';
  labelTarget.textContent = source.checked ? 'OFF' : 'ON';
};
muteToggle.addEventListener('change', () => {
  syncToggles(muteToggle, muteToggleMobile, toggleLabel, toggleLabelMobile);
  playSound('https://res.cloudinary.com/dufkkffxd/video/upload/v1746420154/coin_j82rku.wav'); // coin-sound
});
muteToggleMobile.addEventListener('change', () => {
  syncToggles(muteToggleMobile, muteToggle, toggleLabelMobile, toggleLabel);
  playSound('https://res.cloudinary.com/dufkkffxd/video/upload/v1746420154/coin_j82rku.wav'); // coin-sound
});