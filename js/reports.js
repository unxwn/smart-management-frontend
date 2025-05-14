let currentReportPage = 1;
let currentReportsSearch = '';
let currentReportType = 'dispense';

function generateReport() {
    const dispensedItems = JSON.parse(localStorage.getItem('dispensedItems')) || [];
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const startDate = document.getElementById('report-start-date').value;
    const endDate = document.getElementById('report-end-date').value;

    if (currentReportType === 'dispense') {
        let filteredItems = [...dispensedItems];
        if (startDate) filteredItems = filteredItems.filter(item => item.date >= startDate);
        if (endDate) filteredItems = filteredItems.filter(item => item.date <= endDate);
        if (currentReportsSearch) {
            filteredItems = filteredItems.filter(item =>
                item.patient.toLowerCase().includes(currentReportsSearch) ||
                item.itemName.toLowerCase().includes(currentReportsSearch) ||
                item.date.toLowerCase().includes(currentReportsSearch))
        }

        const startIndex = (currentReportPage - 1) * 10;
        const paginatedItems = filteredItems.slice(startIndex, startIndex + 10);
        renderDispenseReport(paginatedItems);

        document.getElementById('total-records').textContent = filteredItems.length;
        const totalAmount = filteredItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        document.getElementById('total-amount').textContent = totalAmount.toFixed(2) + ' грн';

        const paginationContainer = document.querySelector('#reports .pagination-container');
        if (!paginationContainer) {
            const newPaginationContainer = document.createElement('div');
            newPaginationContainer.className = 'pagination-container';
            document.querySelector('#reports').appendChild(newPaginationContainer);
        }
        document.querySelector('#reports .pagination-container').innerHTML = createPagination(filteredItems.length, currentReportPage, 'report');
    } else {
        let filteredServices = [...services];
        if (startDate) filteredServices = filteredServices.filter(service => service.date >= startDate);
        if (endDate) filteredServices = filteredServices.filter(service => service.date <= endDate);
        if (currentReportsSearch) {
            filteredServices = filteredServices.filter(service =>
                service.patient.toLowerCase().includes(currentReportsSearch) ||
                service.name.toLowerCase().includes(currentReportsSearch) ||
                service.date.toLowerCase().includes(currentReportsSearch))
        }

        const startIndex = (currentReportPage - 1) * 10;
        const paginatedServices = filteredServices.slice(startIndex, startIndex + 10);
        renderServicesReport(paginatedServices);

        document.getElementById('total-records').textContent = filteredServices.length;
        const totalAmount = filteredServices.reduce((sum, service) => sum + parseFloat(service.price), 0);
        document.getElementById('total-amount').textContent = totalAmount.toFixed(2) + ' грн';

        const paginationContainer = document.querySelector('#reports .pagination-container');
        if (!paginationContainer) {
            const newPaginationContainer = document.createElement('div');
            newPaginationContainer.className = 'pagination-container';
            document.querySelector('#reports').appendChild(newPaginationContainer);
        }
        document.querySelector('#reports .pagination-container').innerHTML = createPagination(filteredServices.length, currentReportPage, 'report');
    }
}

function renderDispenseReport(items) {
    const reportTable = document.getElementById('report-table').querySelector('tbody');
    reportTable.innerHTML = '';
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.patient}</td>
            <td>${item.itemName}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)} грн</td>
            <td>${item.amount} грн</td>
        `;
        reportTable.appendChild(row);
    });
}

function renderServicesReport(services) {
    const servicesTable = document.getElementById('services-report-table').querySelector('tbody');
    servicesTable.innerHTML = '';
    services.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.date}</td>
            <td>${service.patient}</td>
            <td>${service.name}</td>
            <td>${service.price.toFixed(2)} грн</td>
        `;
        servicesTable.appendChild(row);
    });
}

document.querySelectorAll('.report-type-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.report-type-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentReportType = this.dataset.reportType;
        document.getElementById('dispense-report').style.display = currentReportType === 'dispense' ? 'block' : 'none';
        document.getElementById('services-report').style.display = currentReportType === 'services' ? 'block' : 'none';
        generateReport();
    });
});

document.getElementById('report-start-date').addEventListener('change', generateReport);
document.getElementById('report-end-date').addEventListener('change', generateReport);

document.addEventListener('DOMContentLoaded', generateReport);