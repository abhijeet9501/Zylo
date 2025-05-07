renderUser(false);

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

const PROFILE_URL = "/api/v1/profile";


const getUserProfile = async (username) => {
    const response = await fetch (`${PROFILE_URL}/${username}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    });
    
    if (!response.ok) {
        showPopUp("User not found!", true);
        setTimeout(() => {
            window.location.href = "/index.html";
        }, 900);
    };
    
    const data = await response.json();
    
    if (data.success)
        {
            renderProfileUser(data.user);
        }
    };
    

getUserProfile(username);

const renderProfileUser = (user) => {
    document.querySelector('.profile-avatar').src = user.avatar.url;
    document.querySelector('.profile-name').textContent = user.name;
    document.querySelector('.profile-username').textContent = `@${user.username}`;
    document.querySelector('.profile-bio').textContent = user?.bio || "";
    document.querySelector('.user-following').textContent = user?.following || 0;
    document.querySelector('.user-followers').textContent = user?.followers || 0;
};