import { apiFetch } from './utils.js';

const form = document.getElementById('login-form');
const errorContainer = document.getElementById('login-error');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username')?.value.trim();
    const password = document.getElementById('login-password')?.value;

    if (!username || !password) {
      errorContainer.textContent = 'Будь ласка, введіть логін і пароль.';
      return;
    }

    try {
      const { token } = await apiFetch('Auth/login', {
        method: 'POST',
        requiresAuth: false,
        body: { username, password }
      });
      localStorage.setItem('jwt', token);
      window.location.href = 'index.html';
    } catch (err) {
      console.error(err);
      errorContainer.textContent = 'Невірний логін або пароль.';
    }
  });
} else {
  console.error('Login form not found in login.js');
}