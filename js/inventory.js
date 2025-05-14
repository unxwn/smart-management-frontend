let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let currentInventoryPage = 1;
let currentInventorySort = 'name-asc';
let currentInventorySearch = '';

function renderInventory() {
    const inventoryTable = document.getElementById('inventory-table').querySelector('tbody');
    inventoryTable.innerHTML = '';

    let filteredInventory = [...inventory];
    if (currentInventorySearch) {
        filteredInventory = filteredInventory.filter(item =>
            item.name.toLowerCase().includes(currentInventorySearch) ||
            item.article.toLowerCase().includes(currentInventorySearch) ||
            item.supplier.toLowerCase().includes(currentInventorySearch))
    }

    switch (currentInventorySort) {
        case 'name-asc':
            filteredInventory.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredInventory.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    const startIndex = (currentInventoryPage - 1) * 10;
    const paginatedInventory = filteredInventory.slice(startIndex, startIndex + 10);

    paginatedInventory.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.article}</td>
            <td>${item.name}</td>
            <td>${item.supplier}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)} грн</td>
            <td>
                <button class="action-btn edit-btn" onclick="editItem(${item.id})">Редагувати</button>
                <button class="action-btn delete-btn" onclick="deleteItem(${item.id})">Видалити</button>
            </td>
        `;
        inventoryTable.appendChild(row);
    });

    const paginationContainer = document.querySelector('#inventory .pagination-container');
    if (!paginationContainer) {
        const newPaginationContainer = document.createElement('div');
        newPaginationContainer.className = 'pagination-container';
        document.querySelector('#inventory').appendChild(newPaginationContainer);
    }
    document.querySelector('#inventory .pagination-container').innerHTML = createPagination(filteredInventory.length, currentInventoryPage, 'inventory');
}

function editItem(id) {
    const item = inventory.find(item => item.id === id);
    if (item) {
        document.getElementById('item-id').value = item.id;
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-supplier').value = item.supplier;
        document.getElementById('item-quantity').value = item.quantity;
        document.getElementById('item-price').value = item.price;
        document.getElementById('modal-title').textContent = 'Редагувати товар';
        document.getElementById('item-modal').style.display = 'block';
    }
}

function deleteItem(id) {
    itemToDelete = id;
    document.getElementById('confirm-item-delete').style.display = 'block';
}

document.getElementById('add-item-btn').addEventListener('click', function () {
    document.getElementById('item-form').reset();
    document.getElementById('item-id').value = '';
    document.getElementById('modal-title').textContent = 'Додати товар';
    document.getElementById('item-modal').style.display = 'block';
});

document.getElementById('item-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const itemId = document.getElementById('item-id').value;
    const itemData = {
        name: document.getElementById('item-name').value,
        supplier: document.getElementById('item-supplier').value,
        quantity: parseInt(document.getElementById('item-quantity').value),
        price: parseFloat(document.getElementById('item-price').value),
        lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (itemId) {
        const index = inventory.findIndex(item => item.id === parseInt(itemId));
        if (index !== -1) inventory[index] = { ...inventory[index], ...itemData };
    } else {
        itemData.id = Date.now();
        itemData.article = 'MED-' + Math.floor(1000 + Math.random() * 9000);
        inventory.push(itemData);
    }

    localStorage.setItem('inventory', JSON.stringify(inventory));
    renderInventory();
    updateStats();
    document.getElementById('item-modal').style.display = 'none';
});

document.getElementById('confirm-item-delete-btn').addEventListener('click', function () {
    if (itemToDelete) {
        inventory = inventory.filter(item => item.id !== itemToDelete);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        renderInventory();
        updateStats();
        itemToDelete = null;
    }
    document.getElementById('confirm-item-delete').style.display = 'none';
});

document.querySelectorAll('#inventory .sort-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('#inventory .sort-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentInventorySort = this.dataset.sort;
        renderInventory();
    });
});

document.addEventListener('DOMContentLoaded', renderInventory);