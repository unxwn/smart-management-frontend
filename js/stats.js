function updateStats() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const dispensedItems = JSON.parse(localStorage.getItem('dispensedItems')) || [];
    const today = new Date().toISOString().split('T')[0];

    const todayAppointments = appointments.filter(a => a.date === today).length;
    const todayServices = services.filter(s => s.date === today).length;
    const totalMedicines = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const todayDispensed = dispensedItems.filter(d => d.date === today).length;
    const todayDispensedIncome = dispensedItems
        .filter(d => d.date === today)
        .reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const todayServicesIncome = services
        .filter(s => s.date === today)
        .reduce((sum, service) => sum + parseFloat(service.price), 0);

    document.getElementById('today-patients').textContent = todayAppointments;
    document.getElementById('today-services').textContent = todayServices;
    document.getElementById('total-medicines').textContent = totalMedicines;
    document.getElementById('today-dispensed').textContent = todayDispensed;
    document.getElementById('today-dispensed-income').textContent = todayDispensedIncome.toFixed(2) + ' грн';
    document.getElementById('today-services-income').textContent = todayServicesIncome.toFixed(2) + ' грн';
}

document.addEventListener('DOMContentLoaded', updateStats);