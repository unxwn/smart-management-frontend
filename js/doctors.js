import { apiFetch } from './utils.js';

const tableBody = document.querySelector('#doctors-table tbody');
const modal = document.getElementById('doctor-modal');
const form = document.getElementById('doctor-form');

let allDoctors = [];
let filteredDoctors = [];

export async function loadDoctors() {
  try {
    const data = await apiFetch('Doctors');
    allDoctors = data;
    filteredDoctors = [...allDoctors];
    renderDoctors(filteredDoctors);
  } catch (e) {
    console.error('Помилка завантаження:', e);
    alert('Не вдалося завантажити лікарів: ' + e.message);
  }
}

function renderDoctors(doctors) {
  tableBody.innerHTML = doctors.map(doctor => `
        <tr>
            <td>${doctor.firstName}</td>
            <td>${doctor.lastName}</td>
            <td>${doctor.specialty}</td>
            <td>${doctor.phone || '—'}</td>
            <td>
                <button onclick="editDoctor(${doctor.id})">✎</button>
                <button onclick="confirmDeleteDoctor(${doctor.id})">🗑</button>
            </td>
        </tr>
    `).join('');
}

window.searchDoctors = function () {
  const searchTerm = document.getElementById('doctors-search').value.toLowerCase();

  if (!searchTerm) {
    filteredDoctors = [...allDoctors];
  } else {
    filteredDoctors = allDoctors.filter(doctor =>
      doctor.firstName.toLowerCase().includes(searchTerm) ||
      doctor.lastName.toLowerCase().includes(searchTerm) ||
      doctor.specialty.toLowerCase().includes(searchTerm)
    );
  }

  renderDoctors(filteredDoctors);
};

window.clearDoctorsSearch = function () {
  document.getElementById('doctors-search').value = '';
  filteredDoctors = [...allDoctors];
  renderDoctors(filteredDoctors);
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const doctorData = {
    id: document.getElementById('doctor-id').value || 0,
    firstName: document.getElementById('doctor-first-name').value,
    lastName: document.getElementById('doctor-last-name').value,
    specialty: document.getElementById('doctor-specialty').value,
    phone: document.getElementById('doctor-phone').value || null
  };

  try {
    const method = doctorData.id ? 'PUT' : 'POST';
    await apiFetch('Doctors', {
      method,
      body: doctorData
    });
    await loadDoctors();
    modal.style.display = 'none';
  } catch (error) {
    console.error('Помилка збереження:', error);
    alert('Не вдалося зберегти лікаря: ' + error.message);
  }
});

window.editDoctor = async (id) => {
  try {
    const doctor = await apiFetch(`Doctors/${id}`);

    document.getElementById('doctor-id').value = doctor.id;
    document.getElementById('doctor-first-name').value = doctor.firstName;
    document.getElementById('doctor-last-name').value = doctor.lastName;
    document.getElementById('doctor-specialty').value = doctor.specialty;
    document.getElementById('doctor-phone').value = doctor.phone || '';

    modal.style.display = 'block';
  } catch (error) {
    console.error('Помилка завантаження:', error);
  }
};

window.confirmDeleteDoctor = (id) => {
  const confirmModal = document.getElementById('confirm-doctor-delete');
  confirmModal.style.display = 'block';

  document.getElementById('confirm-doctor-delete-btn').onclick = async () => {
    try {
      await apiFetch(`Doctors/${id}`, { method: 'DELETE' });
      await loadDoctors();
      confirmModal.style.display = 'none';
    } catch (error) {
      console.error('Помилка видалення:', error);
    }
  };
};

document.addEventListener('DOMContentLoaded', () => {
  const tabLinks = document.querySelectorAll('.nav-links li');
  const sortButtons = document.querySelectorAll('#doctors .sort-btn');

  tabLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (link.dataset.tab === 'doctors') {
        loadDoctors();
      }
    });
  });

  sortButtons.forEach(button => {
    button.addEventListener('click', () => {
      const sortType = button.dataset.sort;

      switch (sortType) {
        case 'doctor-firstName-asc':
          filteredDoctors.sort((a, b) => a.firstName.localeCompare(b.firstName));
          break;
        case 'doctor-firstName-desc':
          filteredDoctors.sort((a, b) => b.firstName.localeCompare(a.firstName));
          break;
        case 'doctor-lastName-asc':
          filteredDoctors.sort((a, b) => a.lastName.localeCompare(b.lastName));
          break;
        case 'doctor-lastName-desc':
          filteredDoctors.sort((a, b) => b.lastName.localeCompare(a.lastName));
          break;
        case 'specialty-asc':
          filteredDoctors.sort((a, b) => a.specialty.localeCompare(b.specialty));
          break;
        case 'specialty-desc':
          filteredDoctors.sort((a, b) => b.specialty.localeCompare(a.specialty));
          break;
      }

      renderDoctors(filteredDoctors);
    });
  });

  document.getElementById('doctors-search')?.addEventListener('input', searchDoctors);

  if (window.location.hash === '#doctors') {
    loadDoctors();
  }

  document.getElementById('add-doctor-btn')?.addEventListener('click', () => {
    form.reset();
    document.getElementById('doctor-id').value = '';
    modal.style.display = 'block';
  });
});
