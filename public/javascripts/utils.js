function updateLocalStorageObject(key, updates = {}) {
    const current = JSON.parse(localStorage.getItem(key)) || {};
    const updated = { ...current, ...updates };
    localStorage.setItem(key, JSON.stringify(updated));
};


let popUpTimeout;

function showPopUp(message) {
  const messageEl = document.getElementById("error-message");

  clearTimeout(popUpTimeout); 
  messageEl.textContent = message;

  messageEl.classList.remove("fade-out");
  messageEl.classList.add("fade-in");
  messageEl.style.display = "block";

  popUpTimeout = setTimeout(() => {
    messageEl.classList.remove("fade-in");
    messageEl.classList.add("fade-out");

    setTimeout(() => {
      messageEl.style.display = "none";
    }, 400); 
  }, 2000);
};



  