document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const msgBox = document.getElementById('auth-message');

    const showMessage = (text, type) => {
        msgBox.textContent = text;
        msgBox.className = `message show ${type}`;
        setTimeout(() => msgBox.classList.remove('show'), 3000);
    };

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';
            btn.disabled = true;

            setTimeout(() => {
                showMessage('Login successful!', 'success');
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = registerForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';
            btn.disabled = true;

            setTimeout(() => {
                showMessage('Account created successfully!', 'success');
                window.location.href = 'index.html';
            }, 1000);
        });
    }
});
