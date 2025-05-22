import { apiFetch } from './utils.js';

const form = document.getElementById('register-form');
const errorContainer = document.getElementById('register-error');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username')?.value.trim();
    const password = document.getElementById('register-password')?.value;

    if (!username || !password) {
      errorContainer.textContent = 'Будь ласка, заповніть усі поля.';
      return;
    }

    try {
      const response = await fetch('https://smart-management-backend-4.onrender.com/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || response.statusText);
      }

      window.location.href = 'login.html';
    } catch (err) {
      console.error(err);
      errorContainer.textContent = 'Не вдалося зареєструватися. ' + err.message;
    }
  });
} else {
  console.error('Register form not found in register.js');
}