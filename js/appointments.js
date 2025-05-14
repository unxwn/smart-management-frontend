let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let currentAppointmentsPage = 1;
let currentAppointmentsSort = 'date-desc';
let currentAppointmentsSearch = '';

function renderAppointments() {
    const appointmentsTable = document.getElementById('appointments-table').querySelector('tbody');
    appointmentsTable.innerHTML = '';

    let filteredAppointments = [...appointments];
    if (currentAppointmentsSearch) {
        filteredAppointments = filteredAppointments.filter(appointment =>
            appointment.name.toLowerCase().includes(currentAppointmentsSearch) ||
            appointment.phone.toLowerCase().includes(currentAppointmentsSearch) ||
            appointment.reason.toLowerCase().includes(currentAppointmentsSearch) ||
            appointment.date.toLowerCase().includes(currentAppointmentsSearch)
        )
    }

    switch (currentAppointmentsSort) {
        case 'date-desc':
            filteredAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-asc':
            filteredAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'name-asc':
            filteredAppointments.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredAppointments.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    const startIndex = (currentAppointmentsPage - 1) * 10;
    const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + 10);

    paginatedAppointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.date}</td>
            <td>${appointment.name}</td>
            <td>${appointment.reason}</td>
            <td>${appointment.phone}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editAppointment(${appointment.id})">Редагувати</button>
                <button class="action-btn delete-btn" onclick="deleteAppointment(${appointment.id})">Видалити</button>
            </td>
        `;
        appointmentsTable.appendChild(row);
    });

    const paginationContainer = document.querySelector('#appointments .pagination-container');
    if (!paginationContainer) {
        const newPaginationContainer = document.createElement('div');
        newPaginationContainer.className = 'pagination-container';
        document.querySelector('#appointments .appointments-list').appendChild(newPaginationContainer);
    }
    document.querySelector('#appointments .pagination-container').innerHTML = createPagination(filteredAppointments.length, currentAppointmentsPage, 'appointments');
}

function editAppointment(id) {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
        document.getElementById('appointment-id').value = appointment.id;
        document.getElementById('patient-name').value = appointment.name;
        document.getElementById('patient-phone').value = appointment.phone;
        document.getElementById('patient-reason').value = appointment.reason;
        document.getElementById('appointment-date').value = appointment.date;
        document.getElementById('appointment-modal-title').textContent = 'Редагувати запис';
        document.getElementById('appointment-modal').style.display = 'block';
    }
}

function deleteAppointment(id) {
    appointmentToDelete = id;
    document.getElementById('confirm-appointment-delete').style.display = 'block';
}

document.getElementById('add-appointment-btn').addEventListener('click', function () {
    document.getElementById('appointment-form').reset();
    document.getElementById('appointment-id').value = '';
    document.getElementById('appointment-modal-title').textContent = 'Додати запис';
    document.getElementById('appointment-modal').style.display = 'block';
});

document.getElementById('appointment-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const appointmentId = document.getElementById('appointment-id').value;
    const newAppointment = {
        id: appointmentId ? parseInt(appointmentId) : Date.now(),
        date: document.getElementById('appointment-date').value || new Date().toISOString().split('T')[0],
        name: document.getElementById('patient-name').value,
        reason: document.getElementById('patient-reason').value,
        phone: document.getElementById('patient-phone').value,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (appointmentId) {
        const index = appointments.findIndex(a => a.id === parseInt(appointmentId));
        if (index !== -1) appointments[index] = newAppointment;
    } else {
        appointments.push(newAppointment);
    }

    localStorage.setItem('appointments', JSON.stringify(appointments));
    renderAppointments();
    updateStats();
    document.getElementById('appointment-modal').style.display = 'none';
});

document.getElementById('confirm-appointment-delete-btn').addEventListener('click', function () {
    if (appointmentToDelete) {
        appointments = appointments.filter(a => a.id !== appointmentToDelete);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        renderAppointments();
        renderCalendar();
        updateStats();
        appointmentToDelete = null;
    }
    document.getElementById('confirm-appointment-delete').style.display = 'none';
});

document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.getElementById('confirm-appointment-delete').style.display = 'none';
        appointmentToDelete = null;
    });
});

document.querySelectorAll('#appointments .sort-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('#appointments .sort-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentAppointmentsSort = this.dataset.sort;
        renderAppointments();
    });
});

document.addEventListener('DOMContentLoaded', renderAppointments);

