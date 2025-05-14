document.addEventListener('DOMContentLoaded', function () {
    function checkAuth() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            window.location.href = 'login.html';
        }
    }

    if (window.location.pathname.endsWith('index.html')) {
        checkAuth();

        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            document.getElementById('user-name').textContent = user.name;
        }

        document.getElementById('logout-btn').addEventListener('click', function () {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }

    if (window.location.pathname.endsWith('login.html')) {
        document.getElementById('show-register').addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('register-form').style.display = 'block';
        });

        document.getElementById('show-login').addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('register-form').style.display = 'none';
            document.getElementById('login-form').style.display = 'block';
        });

        document.getElementById('login-btn').addEventListener('click', function () {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert('Невірний email або пароль');
            }
        });

        document.getElementById('register-btn').addEventListener('click', function () {
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            if (password !== confirmPassword) {
                alert('Паролі не співпадають');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];

            if (users.some(u => u.email === email)) {
                alert('Користувач з таким email вже існує');
                return;
            }

            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));

            alert('Реєстрація успішна!');
            window.location.href = 'index.html';
        });
    }
});