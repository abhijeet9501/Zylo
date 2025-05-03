const profileBaseUrl = "/api/v1/profile";

const profileUpdate = async () => {
  const name = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim().toLowerCase();
  const bio = document.getElementById("bio").value.trim();
  const data = {};
  if (name) data.name = name;
  if (username) data.username = username;
  if (bio) data.bio = bio;


  fetch(`${profileBaseUrl}/update`, {
    method: 'PUT',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  .then (response => response.json())
  .then (data => {
    showPopUp(data.message);
  })
  .catch (e => {
    console.log(e);
  });
};

const profileInfoBtn = document.getElementById("profile-submit-btn");

profileInfoBtn.addEventListener("click", () => {
  profileUpdate();
  setTimeout(() => {
    localStorage.removeItem("user");
    window.location.reload();
  }, 600);
});




const profileAvatarUpdate = async () => {
  const avatarInput = document.getElementById("avatarInput");
  const file = avatarInput.files[0];

  if (file) {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${profileBaseUrl}/avatar`, {
      method: "POST",
      credentials: "include", 
      body: formData,
    });

    const data = await response.json();
    updateLocalStorageObject("user", {avatar: data.url});

    showPopUp(data.message);
  }
};

const uploadAvatarBtn = document.getElementById("upload-avatar-btn");

uploadAvatarBtn.addEventListener("click", async () => {
  await profileAvatarUpdate();
  setTimeout(() => {
    window.location.reload();
  }, 600);
});