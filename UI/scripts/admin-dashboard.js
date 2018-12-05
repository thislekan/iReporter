const logoutButton = document.getElementById('log-out');
const incidentViewToggler = document.getElementById('incident-view');
const redFlagsView = document.getElementById('red-flag-list');
const interventionView = document.getElementById('intervention-list');
const incidentTitleElement = document.getElementById('incident-title');
const allEditButtons = document.querySelectorAll('.edit-btn');

redFlagsView.style.display = 'grid';
incidentTitleElement.innerText = 'Recently created red flags';
interventionView.style.display = 'none';

function toggleView() {
  switch (incidentViewToggler.value) {
    case 'red-flag':
      incidentTitleElement.innerText = 'Recently created red flags';
      interventionView.style.display = 'none';
      redFlagsView.style.display = 'grid'
      break;
    case 'intervention':
      incidentTitleElement.innerText = 'Recently created interventions'
      redFlagsView.style.display = 'none';
      interventionView.style.display = 'grid'
    default:
      break;
  }
}

function openEditPage(incidentId, creatorId, IncidentType) {
  sessionStorage.setItem('creatorId', creatorId);
  sessionStorage.setItem('incidentId', incidentId);
  sessionStorage.setItem('incidentType', IncidentType);
  location.href = '../../views/admin/admin-edit.html';
}

allEditButtons.forEach(button => {
  button.addEventListener('click', () => {
    const grandParent = button.parentElement.parentElement;
    const creatorId = grandParent.querySelector('.creator-id').innerText;
    const incidentId = grandParent.querySelector('.incident-id').innerText;
    let IncidentType;

    if (grandParent.classList.contains('red-flag')) {
      IncidentType = 'redFlag';
    } else {
      IncidentType = 'intervention';
    }

    openEditPage(incidentId, creatorId, IncidentType);
  });
});

logoutButton.addEventListener('click', () => location.href = '../../../index.html');

incidentViewToggler.addEventListener('change', toggleView);
