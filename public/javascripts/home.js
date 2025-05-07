renderUser(false);

const searchUsername = document.getElementById("search-username");

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