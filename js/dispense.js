let dispensedItems = JSON.parse(localStorage.getItem('dispensedItems')) || [];
let currentDispensedPage = 1;
let currentDispensedSort = 'date-desc';
let currentDispensedSearch = '';

function renderDispensedItems() {
    const dispenseTable = document.getElementById('dispense-table').querySelector('tbody');
    dispenseTable.innerHTML = '';

    let filteredDispensed = [...dispensedItems];
    if (currentDispensedSearch) {
        filteredDispensed = filteredDispensed.filter(item =>
            item.patient.toLowerCase().includes(currentDispensedSearch) ||
            item.itemName.toLowerCase().includes(currentDispensedSearch) ||
            item.date.toLowerCase().includes(currentDispensedSearch))
    }

    switch (currentDispensedSort) {
        case 'date-desc':
            filteredDispensed.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-asc':
            filteredDispensed.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'name-asc':
            filteredDispensed.sort((a, b) => a.patient.localeCompare(b.patient));
            break;
        case 'name-desc':
            filteredDispensed.sort((a, b) => b.patient.localeCompare(a.patient));
            break;
    }

    const startIndex = (currentDispensedPage - 1) * 10;
    const paginatedDispensed = filteredDispensed.slice(startIndex, startIndex + 10);

    paginatedDispensed.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.patient}</td>
            <td>${item.itemName}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)} грн</td>
            <td>${item.amount} грн</td>
            <td>
                <button class="action-btn delete-btn" onclick="cancelDispense(${item.id})">Скасувати</button>
            </td>
        `;
        dispenseTable.appendChild(row);
    });

    const paginationContainer = document.querySelector('#dispense .pagination-container');
    if (!paginationContainer) {
        const newPaginationContainer = document.createElement('div');
        newPaginationContainer.className = 'pagination-container';
        document.querySelector('#dispense').appendChild(newPaginationContainer);
    }
    document.querySelector('#dispense .pagination-container').innerHTML = createPagination(filteredDispensed.length, currentDispensedPage, 'dispensed');
}

function cancelDispense(id) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const dispenseIndex = dispensedItems.findIndex(d => d.id === id);
    if (dispenseIndex === -1) return;

    const dispensedItem = dispensedItems[dispenseIndex];
    const itemIndex = inventory.findIndex(item => item.id === dispensedItem.itemId);
    if (itemIndex !== -1) {
        inventory[itemIndex].quantity += dispensedItem.quantity;
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }

    dispensedItems.splice(dispenseIndex, 1);
    localStorage.setItem('dispensedItems', JSON.stringify(dispensedItems));
    renderInventory();
    renderDispensedItems();
    updateStats();
}

document.getElementById('add-dispense-btn').addEventListener('click', function () {
    document.getElementById('dispense-form').reset();
    document.getElementById('dispense-quantity').value = '1';
    document.getElementById('dispense-modal-title').textContent = 'Видача товару';
    updateDispensePatients();
    updateDispenseItems();
    document.getElementById('dispense-modal').style.display = 'block';
});

function updateDispensePatients() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const dispensePatient = document.getElementById('dispense-patient');
    dispensePatient.innerHTML = '<option value="">Оберіть пацієнта</option>';
    const uniquePatients = [...new Set(appointments.map(a => a.name))];
    uniquePatients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient;
        option.textContent = patient;
        dispensePatient.appendChild(option);
    });
}

function updateDispenseItems() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const dispenseItem = document.getElementById('dispense-item');
    dispenseItem.innerHTML = '<option value="">Оберіть товар</option>';
    inventory.forEach(item => {
        if (item.quantity > 0) {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.name} (${item.quantity} шт.)`;
            dispenseItem.appendChild(option);
        }
    });
}

document.getElementById('dispense-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const patient = document.getElementById('dispense-patient').value;
    const itemId = parseInt(document.getElementById('dispense-item').value);
    const quantity = parseInt(document.getElementById('dispense-quantity').value);

    if (!patient || !itemId || !quantity) {
        alert('Будь ласка, заповніть всі поля');
        return;
    }

    const itemIndex = inventory.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    if (inventory[itemIndex].quantity < quantity) {
        alert('Недостатня кількість товару на складі');
        return;
    }

    inventory[itemIndex].quantity -= quantity;
    localStorage.setItem('inventory', JSON.stringify(inventory));

    const item = inventory[itemIndex];
    const today = new Date().toISOString().split('T')[0];
    const dispensedItem = {
        id: Date.now(),
        date: today,
        patient: patient,
        itemId: item.id,
        itemName: item.name,
        quantity: quantity,
        price: item.price,
        amount: (item.price * quantity).toFixed(2),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    dispensedItems.push(dispensedItem);
    localStorage.setItem('dispensedItems', JSON.stringify(dispensedItems));
    renderInventory();
    renderDispensedItems();
    updateStats();
    document.getElementById('dispense-modal').style.display = 'none';
});

document.querySelectorAll('#dispense .sort-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('#dispense .sort-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentDispensedSort = this.dataset.sort;
        renderDispensedItems();
    });
});

document.addEventListener('DOMContentLoaded', renderDispensedItems);