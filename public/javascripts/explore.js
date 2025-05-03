 // Mock User Data
 const users = [
    { name: 'John Smith', username: '@john_smith', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' },
    { name: 'Jane Doe', username: '@jane_doe', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' },
    { name: 'Alex Gamer', username: '@alex_gamer', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg' },
    { name: 'Pixel Pro', username: '@pixel_pro', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' },
    { name: 'Retro Fan', username: '@retro_fan', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg' }
  ];

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

  // Search Functionality
  const searchInput = document.querySelector('.search-bar input');
  const userList = document.querySelector('.user-list');
  const tweetsList = document.querySelector('.tweets-list');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    userList.innerHTML = '';
    if (query) {
      const filteredUsers = users.filter(user => user.username.toLowerCase().includes(query));
      filteredUsers.forEach(user => {
        const userCard = document.createElement('a');
        userCard.href = '/profile'; // Mock link to profile
        userCard.className = 'user-card';
        userCard.setAttribute('aria-label', `View ${user.name}'s profile`);
        userCard.innerHTML = `
          <img src="${user.avatar}" alt="${user.name}'s avatar" class="avatar" />
          <div>
            <span class="name">${user.name}</span>
            <span class="username">${user.username}</span>
          </div>
        `;
        userList.appendChild(userCard);
      });
      userList.classList.add('active');
      tweetsList.classList.add('hidden');
    } else {
      userList.classList.remove('active');
      tweetsList.classList.remove('hidden');
    }
  });

  // Like Button Toggle
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