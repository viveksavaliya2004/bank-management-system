// Application State
let balance = 32845.50;
const transactions = [
    {
        id: 1,
        type: 'expense',
        title: 'Netflix Subscription',
        date: 'Today, 10:24 AM',
        amount: -15.99,
        icon: 'fa-film'
    },
    {
        id: 2,
        type: 'income',
        title: 'Salary Deposit',
        date: 'Yesterday, 09:00 AM',
        amount: 5200.00,
        icon: 'fa-money-bill-wave'
    },
    {
        id: 3,
        type: 'expense',
        title: 'Whole Foods Market',
        date: 'Oct 24, 18:30 PM',
        amount: -142.50,
        icon: 'fa-cart-shopping'
    },
    {
        id: 4,
        type: 'expense',
        title: 'Uber Ride',
        date: 'Oct 23, 22:15 PM',
        amount: -24.00,
        icon: 'fa-car'
    }
];

// DOM Elements
const elements = {
    balance: document.getElementById('total-balance'),
    transferAmount: document.getElementById('transfer-amount'),
    recipientAccount: document.getElementById('recipient-account'),
    msgBox: document.getElementById('transfer-message'),
    transactionList: document.getElementById('transaction-list'),
    btnTransfer: document.getElementById('btn-transfer')
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
    // Adding animation by scaling momentarily
    elements.balance.style.transform = 'scale(1.05)';
    elements.balance.textContent = formatCurrency(balance);
    setTimeout(() => {
        elements.balance.style.transform = 'scale(1)';
    }, 200);
};

// Render Transactions List
const renderTransactions = () => {
    elements.transactionList.innerHTML = '';
    
    transactions.forEach((tx, index) => {
        const li = document.createElement('li');
        li.className = 'transaction-item';
        // Cascade animation delay
        li.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        li.style.opacity = '0';
        
        const isPositive = tx.amount > 0;
        const iconClass = isPositive ? 'income' : 'expense';
        const sign = isPositive ? '+' : '';
        
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
                ${sign}${formatCurrency(tx.amount)}
            </div>
        `;
        elements.transactionList.appendChild(li);
    });
};

// Handle Transfer Action
const handleTransfer = () => {
    const amount = parseFloat(elements.transferAmount.value);
    const recipient = elements.recipientAccount.value.trim();

    // Basic Validation
    if (isNaN(amount) || amount <= 0) {
        showMessage('Please enter a valid amount', 'error');
        return;
    }
    
    if (!recipient) {
        showMessage('Please enter a recipient account or email', 'error');
        return;
    }

    if (amount > balance) {
        showMessage('Insufficient funds available', 'error');
        return;
    }

    // Process Transfer (Simulation)
    
    // Disable button during "processing"
    const originalText = elements.btnTransfer.innerHTML;
    elements.btnTransfer.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    elements.btnTransfer.disabled = true;

    setTimeout(() => {
        balance -= amount;
        
        // Add to recent transactions array at the beginning
        transactions.unshift({
            id: Date.now(),
            type: 'expense',
            title: `Transfer to ${recipient}`,
            date: 'Just now',
            amount: -amount,
            icon: 'fa-paper-plane'
        });

        // Limit transactions list to 6 max for display purposes
        if(transactions.length > 6) transactions.pop();

        // Update UI
        renderBalance();
        renderTransactions();
        
        // Clear inputs
        elements.transferAmount.value = '';
        elements.recipientAccount.value = '';

        showMessage(`Successfully sent $${amount} to ${recipient}`, 'success');
        
        // Restore button
        elements.btnTransfer.innerHTML = originalText;
        elements.btnTransfer.disabled = false;
    }, 1000); // 1s simulation delay
};

// Show Toast Message Function
let messageTimeout;
const showMessage = (text, type) => {
    clearTimeout(messageTimeout);
    elements.msgBox.textContent = text;
    elements.msgBox.className = `message show ${type}`;
    
    messageTimeout = setTimeout(() => {
        elements.msgBox.classList.remove('show');
    }, 4000);
};

// Add initial CSS animation for elements
const injectAnimations = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    injectAnimations();
    renderBalance();
    renderTransactions();
    
    // Bind click event to transfer button
    elements.btnTransfer.addEventListener('click', handleTransfer);

    // Allow pressing "Enter" in the inputs
    [elements.transferAmount, elements.recipientAccount].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleTransfer();
            }
        });
    });
});
