function searchAppointments() {
    currentAppointmentsSearch = document.getElementById('appointments-search').value.toLowerCase();
    currentAppointmentsPage = 1;
    renderAppointments();
}

function clearAppointmentsSearch() {
    document.getElementById('appointments-search').value = '';
    currentAppointmentsSearch = '';
    currentAppointmentsPage = 1;
    renderAppointments();
}

function searchServices() {
    currentServicesSearch = document.getElementById('services-search').value.toLowerCase();
    currentServicesPage = 1;
    renderServices();
}

function clearServicesSearch() {
    document.getElementById('services-search').value = '';
    currentServicesSearch = '';
    currentServicesPage = 1;
    renderServices();
}

function searchInventory() {
    currentInventorySearch = document.getElementById('inventory-search').value.toLowerCase();
    currentInventoryPage = 1;
    renderInventory();
}

function clearInventorySearch() {
    document.getElementById('inventory-search').value = '';
    currentInventorySearch = '';
    currentInventoryPage = 1;
    renderInventory();
}

function searchDispensed() {
    currentDispensedSearch = document.getElementById('dispense-search').value.toLowerCase();
    currentDispensedPage = 1;
    renderDispensedItems();
}

function clearDispensedSearch() {
    document.getElementById('dispense-search').value = '';
    currentDispensedSearch = '';
    currentDispensedPage = 1;
    renderDispensedItems();
}

function searchReports() {
    currentReportsSearch = document.getElementById('reports-search').value.toLowerCase();
    currentReportPage = 1;
    generateReport();
}

function clearReportsSearch() {
    document.getElementById('reports-search').value = '';
    currentReportsSearch = '';
    currentReportPage = 1;
    generateReport();
}

document.getElementById('appointments-search').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') searchAppointments();
});

document.getElementById('services-search').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') searchServices();
});

document.getElementById('inventory-search').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') searchInventory();
});

document.getElementById('dispense-search').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') searchDispensed();
});

document.getElementById('reports-search').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') searchReports();
});