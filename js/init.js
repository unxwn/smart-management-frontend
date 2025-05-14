function init() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointment-date').value = today;

    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            currentAppointmentsPage = 1;
            currentServicesPage = 1;
            currentInventoryPage = 1;
            currentDispensedPage = 1;
            currentReportPage = 1;
        });
    });

    document.querySelector('#appointments .sort-btn[data-sort="date-desc"]').classList.add('active');
    document.querySelector('#services .sort-btn[data-sort="date-desc"]').classList.add('active');
    document.querySelector('#inventory .sort-btn[data-sort="name-asc"]').classList.add('active');
    document.querySelector('#dispense .sort-btn[data-sort="date-desc"]').classList.add('active');

    renderAppointments();
    renderCalendar();
    renderServices();
    renderInventory();
    renderDispensedItems();
    updateStats();
    checkLowStock();
    generateReport();
}

document.addEventListener('DOMContentLoaded', init);