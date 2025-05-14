let services = JSON.parse(localStorage.getItem('services')) || [];
let currentServicesPage = 1;
let currentServicesSort = 'date-desc';
let currentServicesSearch = '';

function renderServices() {
    const servicesTable = document.getElementById('services-table').querySelector('tbody');
    servicesTable.innerHTML = '';

    let filteredServices = [...services];
    if (currentServicesSearch) {
        filteredServices = filteredServices.filter(service =>
            service.patient.toLowerCase().includes(currentServicesSearch) ||
            service.name.toLowerCase().includes(currentServicesSearch) ||
            service.date.toLowerCase().includes(currentServicesSearch))
    }

    switch (currentServicesSort) {
        case 'date-desc':
            filteredServices.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-asc':
            filteredServices.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'name-asc':
            filteredServices.sort((a, b) => a.patient.localeCompare(b.patient));
            break;
        case 'name-desc':
            filteredServices.sort((a, b) => b.patient.localeCompare(a.patient));
            break;
    }

    const startIndex = (currentServicesPage - 1) * 10;
    const paginatedServices = filteredServices.slice(startIndex, startIndex + 10);

    paginatedServices.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.date}</td>
            <td>${service.patient}</td>
            <td>${service.name}</td>
            <td>${service.price.toFixed(2)} грн</td>
            <td>
                <button class="action-btn edit-btn" onclick="editService(${service.id})">Редагувати</button>
                <button class="action-btn delete-btn" onclick="deleteService(${service.id})">Видалити</button>
            </td>
        `;
        servicesTable.appendChild(row);
    });

    const paginationContainer = document.querySelector('#services .pagination-container');
    if (!paginationContainer) {
        const newPaginationContainer = document.createElement('div');
        newPaginationContainer.className = 'pagination-container';
        document.querySelector('#services').appendChild(newPaginationContainer);
    }
    document.querySelector('#services .pagination-container').innerHTML = createPagination(filteredServices.length, currentServicesPage, 'services');
}

function editService(id) {
    const service = services.find(s => s.id === id);
    if (service) {
        document.getElementById('service-id').value = service.id;
        document.getElementById('service-patient').value = service.patient;
        document.getElementById('service-name').value = service.name;
        document.getElementById('service-price').value = service.price;
        document.getElementById('service-modal-title').textContent = 'Редагувати послугу';
        document.getElementById('service-modal').style.display = 'block';
    }
}

function deleteService(id) {
    serviceToDelete = id;
    document.getElementById('confirm-service-delete').style.display = 'block';
}

document.getElementById('add-service-btn').addEventListener('click', function () {
    document.getElementById('service-form').reset();
    document.getElementById('service-id').value = '';
    document.getElementById('service-modal-title').textContent = 'Додати послугу';
    updateServicePatients();
    document.getElementById('service-modal').style.display = 'block';
});

function updateServicePatients() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const servicePatient = document.getElementById('service-patient');
    servicePatient.innerHTML = '<option value="">Оберіть пацієнта</option>';
    const uniquePatients = [...new Set(appointments.map(a => a.name))];
    uniquePatients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient;
        option.textContent = patient;
        servicePatient.appendChild(option);
    });
}

document.getElementById('service-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const serviceId = document.getElementById('service-id').value;
    const today = new Date().toISOString().split('T')[0];
    const newService = {
        id: serviceId ? parseInt(serviceId) : Date.now(),
        date: today,
        patient: document.getElementById('service-patient').value,
        name: document.getElementById('service-name').value,
        price: parseFloat(document.getElementById('service-price').value),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (serviceId) {
        const index = services.findIndex(s => s.id === parseInt(serviceId));
        if (index !== -1) services[index] = newService;
    } else {
        services.push(newService);
    }

    localStorage.setItem('services', JSON.stringify(services));
    renderServices();
    document.getElementById('service-modal').style.display = 'none';
});

document.getElementById('confirm-service-delete-btn').addEventListener('click', function () {
    if (serviceToDelete) {
        services = services.filter(s => s.id !== serviceToDelete);
        localStorage.setItem('services', JSON.stringify(services));
        renderServices();
        serviceToDelete = null;
    }
    document.getElementById('confirm-service-delete').style.display = 'none';
});

document.querySelectorAll('#services .sort-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('#services .sort-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentServicesSort = this.dataset.sort;
        renderServices();
    });
});

document.addEventListener('DOMContentLoaded', renderServices);