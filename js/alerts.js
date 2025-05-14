function checkLowStock() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const alertsList = document.getElementById('alerts-list');
    alertsList.innerHTML = '';

    const lowStockItems = inventory.filter(item => item.quantity < 5);

    if (lowStockItems.length === 0) {
        alertsList.innerHTML = '<div class="alert-item">Немає сповіщень</div>';
        return;
    }

    lowStockItems.forEach(item => {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-item';
        alertDiv.innerHTML = `
            <strong>${item.name}</strong>
            <p>Залишилось: ${item.quantity} шт.</p>
        `;
        alertsList.appendChild(alertDiv);
    });
}

document.addEventListener('DOMContentLoaded', checkLowStock);