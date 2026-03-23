window.bankTransactions = window.bankTransactions || [
    { id: 1, type: 'expense', title: 'Netflix Subscription', date: 'Today, 10:24 AM', amount: -15.99, icon: 'fa-film' },
    { id: 2, type: 'income', title: 'Salary Deposit', date: 'Yesterday, 09:00 AM', amount: 5200.00, icon: 'fa-money-bill-wave' },
    { id: 3, type: 'expense', title: 'Whole Foods Market', date: 'Oct 24, 18:30 PM', amount: -142.50, icon: 'fa-cart-shopping' },
    { id: 4, type: 'expense', title: 'Uber Ride', date: 'Oct 23, 22:15 PM', amount: -24.00, icon: 'fa-car' }
];

const renderTransactions = () => {
    const list = document.getElementById('transaction-list');
    if (!list) return;

    list.innerHTML = '';

    window.bankTransactions.forEach((tx, index) => {
        const li = document.createElement('li');
        li.className = 'transaction-item';
        li.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        li.style.opacity = '0';

        const isPositive = tx.amount > 0;
        const iconClass = isPositive ? 'income' : 'expense';
        const sign = isPositive ? '+' : '';

        // formatCurrency is defined globally in account.js
        const formattedAmount = typeof formatCurrency === 'function' ? formatCurrency(tx.amount) : ('$' + tx.amount);

        li.innerHTML = `
            <div class="tx-info">
                <div class="tx-icon ${iconClass}">
                    <i class="fa-solid ${tx.icon}"></i>
                </div>
                <div class="tx-details">
                    <h4>${tx.title}</h4>
                    <p>${tx.date}</p>
                </div>
            </div>
            <div class="tx-amount ${isPositive ? 'positive' : ''}">
                ${sign}${formattedAmount}
            </div>
        `;
        list.appendChild(li);
    });
};

const setupTransferLogic = () => {
    const btnTransfer = document.getElementById('btn-transfer');
    const transferAmount = document.getElementById('transfer-amount');
    const recipientAccount = document.getElementById('recipient-account');
    const msgBox = document.getElementById('transfer-message');

    if (!btnTransfer) return;

    let messageTimeout;
    const showMessage = (text, type) => {
        clearTimeout(messageTimeout);
        msgBox.textContent = text;
        msgBox.className = `message show ${type}`;

        messageTimeout = setTimeout(() => {
            msgBox.classList.remove('show');
        }, 4000);
    };

    const handleTransfer = () => {
        const amount = parseFloat(transferAmount.value);
        const recipient = recipientAccount.value.trim();

        if (isNaN(amount) || amount <= 0) {
            showMessage('Please enter a valid amount', 'error');
            return;
        }

        if (!recipient) {
            showMessage('Please enter a recipient account or email', 'error');
            return;
        }

        if (amount > window.bankState.balance) {
            showMessage('Insufficient funds available', 'error');
            return;
        }

        const originalText = btnTransfer.innerHTML;
        btnTransfer.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        btnTransfer.disabled = true;

        setTimeout(() => {
            window.bankState.balance -= amount;

            window.bankTransactions.unshift({
                id: Date.now(),
                type: 'expense',
                title: `Transfer to ${recipient}`,
                date: 'Just now',
                amount: -amount,
                icon: 'fa-paper-plane'
            });

            if (window.bankTransactions.length > 6) window.bankTransactions.pop();

            // Re-render
            if (typeof renderBalance === 'function') renderBalance();
            renderTransactions();

            transferAmount.value = '';
            recipientAccount.value = '';

            showMessage(`Successfully sent $${amount} to ${recipient}`, 'success');

            btnTransfer.innerHTML = originalText;
            btnTransfer.disabled = false;
        }, 1000);
    };

    btnTransfer.addEventListener('click', handleTransfer);

    [transferAmount, recipientAccount].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleTransfer();
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    renderTransactions();
    setupTransferLogic();
});
