const reportTypeSelection = document.getElementById('report-type');
const interventionsContainer = document.getElementById('intervention-div');
const redFlagsContainer = document.getElementById('red-flag-div');
const logoutButton = document.getElementById('log-out');

const notificationBox = document.getElementById('notification-div');
const notificationBoxCloser = document.getElementById('close-notification');
const notificationTextElement = notificationBox.querySelector('p');
const notificationTitle = notificationBox.querySelector('h3');
const loader = document.getElementById('loader-div');

notificationBox.style.display = 'none';

function showLoader() {
  loader.style.display = 'flex';
}

function displayNotification() {
  if (loader.style.display === 'flex') loader.style.display = 'none';
  notificationBox.style.display = 'flex';
}

notificationBoxCloser.addEventListener('click', () => {
  notificationBox.style.display = 'none';
});

let totalIncidents;
let totalRedFlags;
let totalInterventions;

function seperateReportByType() {
  totalRedFlags = totalIncidents.filter(report => report.type === 'red-flag');
  totalInterventions = totalIncidents.filter(report => report.type === 'intervention');
}

function getReportSummary(params) {
  const created = params.length;
  let resolved;
  let rejected;
  let underInvestigation;
  let draft;

  resolved = params.filter(report => report.status === 'resolved');
  rejected = params.filter(report => report.status === 'rejected');
  draft = params.filter(report => report.status === 'draft');
  underInvestigation = params.filter(report => report.status === 'under-investigation');

  return summary = {
    created,
    resolved: resolved.length,
    rejected: rejected.length,
    draft: draft.length,
    underInvestigation: underInvestigation.length
  }
}

function confirmReportType() {
  const currentReportType = reportTypeSelection.value;
  let divToBePopulated;
  let summary;
  if (currentReportType === 'red-flag') {
    divToBePopulated = redFlagsContainer;
    summary = getReportSummary(totalRedFlags);
  } else {
    divToBePopulated = interventionsContainer;
    summary = getReportSummary(totalInterventions);
  }
  return { divToBePopulated, summary };
}

function populateSummaryDiv() {
  const { divToBePopulated, summary } = confirmReportType();
  const { draft, rejected, resolved, created, underInvestigation } = summary;

  const createdReportsElement = divToBePopulated.querySelector('.created');
  const pendingReportsElement = divToBePopulated.querySelector('.pending');
  const resolvedReportsElement = divToBePopulated.querySelector('.resolved');
  const rejectedReportsElement = divToBePopulated.querySelector('.rejected');
  const underInvestigationReportsElement = divToBePopulated.querySelector('.under-investigation');

  createdReportsElement.innerText = created;
  pendingReportsElement.innerText = draft;
  rejectedReportsElement.innerText = rejected;
  resolvedReportsElement.innerText = resolved;
  underInvestigationReportsElement.innerText = underInvestigation;
}

reportTypeSelection.addEventListener('change', () => {
  const selectedReport = reportTypeSelection.value;
  switch (selectedReport) {
    case 'red-flag':
      populateSummaryDiv();
      redFlagsContainer.style.display = 'block';
      interventionsContainer.style.display = 'none';
      break;
    case 'intervention':
      populateSummaryDiv();
      redFlagsContainer.style.display = 'none';
      interventionsContainer.style.display = 'block';
    default:
      break;
  }
});

logoutButton.addEventListener('click', () => location.href = '../../../index.html');


window.onload = () => {
  showLoader();
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': sessionStorage.getItem('token')
    }
  }

  fetch(`${apiVersion}user/incidents`, options)
    .then(handleResponse)
    .then(res => {
      totalIncidents = [...res.data];
      seperateReportByType();
      populateSummaryDiv();
      loader.style.display = 'none';
    })
    .catch(err => {
      notificationTitle.innerText = 'An error has occured.';
      notificationTextElement.innerText = err.error.error;
      displayNotification();
    });
}