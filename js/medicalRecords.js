import { apiFetch } from './utils.js';

const tableBody = document.querySelector('#medical-records-table tbody');
const addBtn = document.getElementById('add-medical-record-btn');
const modal = document.getElementById('medical-record-modal');
const form = document.getElementById('medical-record-form');

let allPatients = {};
let allRecords = [];
let filteredRecords = [];

async function initData() {
  try {
    const patients = await apiFetch('Patients');
    allPatients = patients.reduce((acc, patient) => ({
      ...acc,
      [patient.id]: patient
    }), {});

    const records = await apiFetch('MedicalRecords');
    allRecords = records;
    filteredRecords = [...allRecords];
    renderRecords(filteredRecords);
    populatePatientSelect();
  } catch (error) {
    console.error('Помилка ініціалізації:', error);
    alert('Не вдалося завантажити дані');
  }
}

function populatePatientSelect() {
  const select = document.getElementById('medical-record-patient-select');
  if (!select) return;

  select.innerHTML = '<option value="">Оберіть пацієнта</option>';

  Object.values(allPatients).forEach(patient => {
    const option = document.createElement('option');
    option.value = patient.id;
    option.textContent = `${patient.firstName} ${patient.lastName}`;
    select.appendChild(option);
  });
}

function renderRecords(records) {
  tableBody.innerHTML = records.map(record => `
        <tr>
            <td>${new Date(record.recordDate).toLocaleDateString()}</td>
            <td>${allPatients[record.patientId]?.firstName || 'Невідомий'} 
                ${allPatients[record.patientId]?.lastName || ''}</td>
            <td>${record.details}</td>
            <td>
                <button onclick="editMedicalRecord(${record.id})">✎</button>
                <button onclick="confirmDeleteMedicalRecord(${record.id})">🗑</button>
            </td>
        </tr>
    `).join('');
}

window.searchMedicalRecords = function () {
  const searchTerm = document.getElementById('medical-records-search').value.toLowerCase();

  if (!searchTerm) {
    filteredRecords = [...allRecords];
  } else {
    filteredRecords = allRecords.filter(record => {
      const patient = allPatients[record.patientId];
      const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
      return patientName.includes(searchTerm) ||
        record.details.toLowerCase().includes(searchTerm);
    });
  }

  renderRecords(filteredRecords);
};

window.clearMedicalRecordsSearch = function () {
  document.getElementById('medical-records-search').value = '';
  filteredRecords = [...allRecords];
  renderRecords(filteredRecords);
};

function openForm(record = null) {
  form.reset();

  if (record) {
    document.getElementById('medical-record-id').value = record.id;
    document.getElementById('medical-record-patient-select').value = record.patientId;
    document.getElementById('medical-record-date').value = record.recordDate.slice(0, 16);
    document.getElementById('medical-record-details').value = record.details;
  } else {
    // Встановлюємо поточну дату та час для нового запису
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 16);
    document.getElementById('medical-record-date').value = localDateTime;
  }

  modal.style.display = 'block';
}

function closeForm() {
  modal.style.display = 'none';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const patientId = document.getElementById('medical-record-patient-select').value;
  const recordDate = document.getElementById('medical-record-date').value;
  const details = document.getElementById('medical-record-details').value;

  if (!patientId) {
    alert('Будь ласка, оберіть пацієнта');
    return;
  }

  if (!recordDate) {
    alert('Будь ласка, вкажіть дату та час');
    return;
  }

  if (!details.trim()) {
    alert('Будь ласка, введіть деталі запису');
    return;
  }

  const recordData = {
    id: document.getElementById('medical-record-id').value || 0,
    patientId: parseInt(patientId),
    recordDate: recordDate + ':00Z',
    details: details.trim()
  };

  try {
    const method = recordData.id ? 'PUT' : 'POST';
    await apiFetch(`MedicalRecords${recordData.id ? `/${recordData.id}` : ''}`, {
      method,
      body: recordData
    });
    await initData();
    closeForm();

    if (method === 'POST') {
      alert('Медичний запис успішно додано!');
    } else {
      alert('Медичний запис успішно оновлено!');
    }
  } catch (error) {
    console.error('Помилка збереження:', error);
    alert('Помилка збереження: ' + error.message);
  }
});

window.editMedicalRecord = async (id) => {
  try {
    const record = await apiFetch(`MedicalRecords/${id}`);
    openForm(record);
  } catch (error) {
    console.error('Помилка завантаження:', error);
    alert('Помилка завантаження запису');
  }
};

window.confirmDeleteMedicalRecord = (id) => {
  const confirmModal = document.getElementById('confirm-medical-delete');
  confirmModal.style.display = 'block';

  document.getElementById('confirm-medical-delete-btn').onclick = async () => {
    try {
      await apiFetch(`MedicalRecords/${id}`, { method: 'DELETE' });
      await initData();
      confirmModal.style.display = 'none';
      alert('Медичний запис успішно видалено!');
    } catch (error) {
      console.error('Помилка видалення:', error);
      alert('Помилка видалення запису');
    }
  };
};

document.addEventListener('DOMContentLoaded', () => {
  const tabLinks = document.querySelectorAll('.nav-links li');

  tabLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (link.dataset.tab === 'medical-records') {
        initData();
      }
    });
  });

  const sortButtons = document.querySelectorAll('#medical-records .sort-btn');
  sortButtons.forEach(button => {
    button.addEventListener('click', () => {
      const sortType = button.dataset.sort;

      switch (sortType) {
        case 'date-asc':
          filteredRecords.sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate));
          break;
        case 'date-desc':
          filteredRecords.sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate));
          break;
        case 'patient-firstName-asc':
          filteredRecords.sort((a, b) => {
            const nameA = allPatients[a.patientId]?.firstName || '';
            const nameB = allPatients[b.patientId]?.firstName || '';
            return nameA.localeCompare(nameB);
          });
          break;
        case 'patient-firstName-desc':
          filteredRecords.sort((a, b) => {
            const nameA = allPatients[a.patientId]?.firstName || '';
            const nameB = allPatients[b.patientId]?.firstName || '';
            return nameB.localeCompare(nameA);
          });
          break;
        case 'patient-lastName-asc':
          filteredRecords.sort((a, b) => {
            const nameA = allPatients[a.patientId]?.lastName || '';
            const nameB = allPatients[b.patientId]?.lastName || '';
            return nameA.localeCompare(nameB);
          });
          break;
        case 'patient-lastName-desc':
          filteredRecords.sort((a, b) => {
            const nameA = allPatients[a.patientId]?.lastName || '';
            const nameB = allPatients[b.patientId]?.lastName || '';
            return nameB.localeCompare(nameA);
          });
          break;
      }

      renderRecords(filteredRecords);
    });
  });

  document.getElementById('medical-records-search')?.addEventListener('input', searchMedicalRecords);

  initData();

  addBtn.addEventListener('click', () => openForm());

  document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', closeForm);
  });

  document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('confirm-medical-delete').style.display = 'none';
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });
});