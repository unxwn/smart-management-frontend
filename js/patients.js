import { apiFetch } from './utils.js';

const tableBody = document.querySelector('#patients-table tbody');
const modal = document.getElementById('patient-modal');
const form = document.getElementById('patient-form');

let allPatients = [];
let filteredPatients = [];

function formatGender(genderCode) {
  return genderCode === 0 ? 'Ч' : 'Ж';
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('uk-UA', options);
}

export async function loadPatients() {
  try {
    const data = await apiFetch('Patients');
    allPatients = data;
    filteredPatients = [...allPatients];
    renderPatients(filteredPatients);
  } catch (e) {
    console.error(e);
    alert('Не вдалося завантажити пацієнтів');
  }
}

function renderPatients(patients) {
  tableBody.innerHTML = patients.map(patient => `
        <tr>
            <td>${patient.firstName}</td>
            <td>${patient.lastName}</td>
            <td>${formatDate(patient.dateOfBirth)}</td>
            <td>${formatGender(patient.gender)}</td>
            <td>${patient.phoneNumber}</td>
            <td>${patient.email || '—'}</td>
            <td>${patient.address || '—'}</td>
            <td>
                <button onclick="editPatient(${patient.id})">✎</button>
                <button onclick="confirmDeletePatient(${patient.id})">🗑</button>
            </td>
        </tr>
    `).join('');
}

window.searchPatients = function () {
  const searchTerm = document.getElementById('patients-search').value.toLowerCase();

  if (!searchTerm) {
    filteredPatients = [...allPatients];
  } else {
    filteredPatients = allPatients.filter(patient =>
      patient.firstName.toLowerCase().includes(searchTerm) ||
      patient.lastName.toLowerCase().includes(searchTerm) ||
      patient.phoneNumber.toLowerCase().includes(searchTerm)
    );
  }

  renderPatients(filteredPatients);
};

window.clearPatientsSearch = function () {
  document.getElementById('patients-search').value = '';
  filteredPatients = [...allPatients];
  renderPatients(filteredPatients);
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const patientData = {
    id: document.getElementById('patient-id').value || 0,
    firstName: document.getElementById('first-name').value,
    lastName: document.getElementById('last-name').value,
    dateOfBirth: document.getElementById('birth-date').value + 'T00:00:00',
    gender: parseInt(document.getElementById('gender').value),
    phoneNumber: document.getElementById('phone').value,
    email: document.getElementById('email').value || null,
    address: document.getElementById('address').value || null
  };

  try {
    const method = patientData.id ? 'PUT' : 'POST';
    await apiFetch('Patients', {
      method,
      body: patientData
    });
    await loadPatients();
    modal.style.display = 'none';
  } catch (error) {
    console.error('Помилка збереження:', error);
    alert('Не вдалося зберегти пацієнта: ' + error.message);
  }
});

window.editPatient = async (id) => {
  try {
    const patient = await apiFetch(`Patients/${id}`);

    document.getElementById('patient-id').value = patient.id;
    document.getElementById('first-name').value = patient.firstName;
    document.getElementById('last-name').value = patient.lastName;
    document.getElementById('birth-date').value =
      patient.dateOfBirth.split('T')[0];
    document.getElementById('gender').value = patient.gender;
    document.getElementById('phone').value = patient.phoneNumber;
    document.getElementById('email').value = patient.email || '';
    document.getElementById('address').value = patient.address || '';

    modal.style.display = 'block';
  } catch (error) {
    console.error('Помилка завантаження:', error);
  }
};

window.confirmDeletePatient = (id) => {
  const confirmModal = document.getElementById('confirm-appointment-delete');
  confirmModal.style.display = 'block';

  document.getElementById('confirm-appointment-delete-btn').onclick = async () => {
    try {
      await apiFetch(`Patients/${id}`, { method: 'DELETE' });
      await loadPatients();
      confirmModal.style.display = 'none';
    } catch (error) {
      console.error('Помилка видалення:', error);
    }
  };
};

document.addEventListener('DOMContentLoaded', () => {
  const tabLinks = document.querySelectorAll('.nav-links li');
  const sortButtons = document.querySelectorAll('#patients .sort-btn');

  tabLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (link.dataset.tab === 'patients') {
        loadPatients();
      }
    });
  });

  sortButtons.forEach(button => {
    button.addEventListener('click', () => {
      const sortType = button.dataset.sort;

      switch (sortType) {
        case 'name-asc':
          filteredPatients.sort((a, b) => a.firstName.localeCompare(b.firstName));
          break;
        case 'name-desc':
          filteredPatients.sort((a, b) => b.firstName.localeCompare(a.firstName));
          break;
        case 'date-asc':
          filteredPatients.sort((a, b) => new Date(a.dateOfBirth) - new Date(b.dateOfBirth));
          break;
        case 'date-desc':
          filteredPatients.sort((a, b) => new Date(b.dateOfBirth) - new Date(a.dateOfBirth));
          break;
      }

      renderPatients(filteredPatients);
    });
  });

  document.getElementById('patients-search')?.addEventListener('input', searchPatients);

  if (window.location.hash === '#patients') {
    loadPatients();
  }

  document.getElementById('add-patient-btn')?.addEventListener('click', () => {
    form.reset();
    document.getElementById('patient-id').value = '';
    modal.style.display = 'block';
  });
});
