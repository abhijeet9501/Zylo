// User Dropdown Toggle
const userAvatar = document.querySelector('.user-avatar');
const userDropdown = document.querySelector('.user-dropdown');
userAvatar?.addEventListener('click', () => {
  userDropdown.classList.toggle('active');
});
document.addEventListener('click', e => {
  if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
    userDropdown.classList.remove('active');
  }
});

// Like Button Toggle
const tweetsList = document.querySelector('.tweets-list');
tweetsList.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (btn?.getAttribute('aria-label')?.includes('Like')) {
    const pressed = btn.getAttribute('aria-pressed') === 'true';
    let count = parseInt(btn.textContent.trim()) || 0;
    count = pressed ? count - 1 : count + 1;
    btn.setAttribute('aria-pressed', !pressed);
    btn.classList.toggle('liked', !pressed);
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.45 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.44C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.45 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      ${count}
    `;
  }
});