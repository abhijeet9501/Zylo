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

// Form Handling
const forms = {
  password: document.querySelector('.password-form'),
  username: document.querySelector('.username-form'),
  name: document.querySelector('.name-form'),
  bio: document.querySelector('.bio-form'),
  email: document.querySelector('.email-form')
};
const inputs = {
  currentPassword: document.querySelector('#current-password'),
  newPassword: document.querySelector('#new-password'),
  confirmPassword: document.querySelector('#confirm-password'),
  username: document.querySelector('#username'),
  name: document.querySelector('#name'),
  bio: document.querySelector('#bio'),
  email: document.querySelector('#email')
};
const errors = {
  currentPassword: document.querySelector('#current-password-error'),
  newPassword: document.querySelector('#new-password-error'),
  confirmPassword: document.querySelector('#confirm-password-error'),
  username: document.querySelector('#username-error'),
  name: document.querySelector('#name-error'),
  bio: document.querySelector('#bio-error'),
  email: document.querySelector('#email-error')
};

// Bio Character Counter
inputs.bio.addEventListener('input', () => {
  document.querySelector('.bio-counter').textContent = 160 - inputs.bio.value.length;
});

// Form Validation
Object.values(forms).forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    const formClass = form.className.split('-')[0];

    // Reset error messages
    Object.values(errors).forEach(error => error.classList.remove('active'));

    if (formClass === 'password') {
      if (!inputs.currentPassword.value) {
        errors.currentPassword.classList.add('active');
        valid = false;
      }
      if (inputs.newPassword.value.length < 6) {
        errors.newPassword.classList.add('active');
        valid = false;
      }
      if (inputs.newPassword.value !== inputs.confirmPassword.value) {
        errors.confirmPassword.classList.add('active');
        valid = false;
      }
    } else if (formClass === 'username') {
      if (inputs.username.value.length < 3 || inputs.username.value.length > 20) {
        errors.username.classList.add('active');
        valid = false;
      }
    } else if (formClass === 'name') {
      if (!inputs.name.value) {
        errors.name.classList.add('active');
        valid = false;
      }
    } else if (formClass === 'bio') {
      if (!inputs.bio.value) {
        errors.bio.classList.add('active');
        valid = false;
      }
    } else if (formClass === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputs.email.value)) {
        errors.email.classList.add('active');
        valid = false;
      }
    }

    if (valid) {
      alert(`${formClass.charAt(0).toUpperCase() + formClass.slice(1)} updated successfully!`);
      form.reset();
      if (formClass === 'username') inputs.username.value = '@john_smith';
      if (formClass === 'name') inputs.name.value = 'John Smith';
      if (formClass === 'bio') {
        inputs.bio.value = 'Game dev by day, retro arcade enthusiast by night. #PixelLife';
        document.querySelector('.bio-counter').textContent = 160 - inputs.bio.value.length;
      }
      if (formClass === 'email') inputs.email.value = 'john.smith@example.com';
    }
  });
});