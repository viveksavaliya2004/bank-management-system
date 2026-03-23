// Shared state simulation could be done with localStorage, but for simple UI we just hardcode.
window.bankState = window.bankState || {
    balance: 32845.50
};

// Format Currency Utility
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Render Balance Function
const renderBalance = () => {
    const balanceEl = document.getElementById('total-balance');
    if (!balanceEl) return;

    balanceEl.style.transform = 'scale(1.05)';
    balanceEl.textContent = formatCurrency(window.bankState.balance);
    setTimeout(() => {
        balanceEl.style.transform = 'scale(1)';
    }, 200);
};

// Animations setup
const injectAnimations = () => {
    if (document.getElementById('animations-style')) return;
    const style = document.createElement('style');
    style.id = 'animations-style';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
};

document.addEventListener('DOMContentLoaded', () => {
    injectAnimations();
    renderBalance();

    // Logout handling
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});
