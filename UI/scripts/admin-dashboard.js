const logoutButton = document.getElementById('log-out');
const incidentViewToggler = document.getElementById('incident-view');
const incidentTitleElement = document.getElementById('incident-title');
const incidentsViewDiv = document.querySelector('.list-of-reports');

let listOfAllIncidents = [];
let filteredList = []

incidentTitleElement.innerText = 'All recently created incidents';

function toggleView() {
  switch (incidentViewToggler.value) {
    case 'all':
      incidentTitleElement.innerText = 'All recently created incidents';
      filteredList = listOfAllIncidents.reverse();
      updateView(filteredList);
      break
    case 'draft':
      incidentTitleElement.innerText = 'All pending incidents';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.status === 'draft');
      updateView(filteredList)
      break;
    case 'resolved':
      incidentTitleElement.innerText = 'All resolved incidents';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.status === 'resolved');
      updateView(filteredList)
      break;
    case 'rejected':
      incidentTitleElement.innerText = 'All rejected incidents';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.status === 'rejected');
      updateView(filteredList)
      break;
    case 'under-investigation':
      incidentTitleElement.innerText = 'All incidents under investigation';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.status === 'under-investigation');
      updateView(filteredList)
      break;
    case 'red-flag':
      incidentTitleElement.innerText = 'All red flags incidents';
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.type === 'red-flag');
      updateView(filteredList.reverse());
      break;
    case 'intervention':
      incidentTitleElement.innerText = 'All intervention incidents'
      filteredList = listOfAllIncidents.reverse().filter(incident => incident.type === 'intervention');
      updateView(filteredList.reverse());
    default:
      break;
  }
}

function dateCreated(date) {
  const created = new Date(Number(date));
  return created;
}

function navigateToEditPage(index) {
  console.log('fired');
  const incident = filteredList[index];
  sessionStorage.setItem('incident', incident.id);
  setTimeout(() => {
    location.href = '../../views/admin/admin-edit.html';
  }, 2000);
}

function updateView(params) {
  incidentsViewDiv.innerHTML = '';
  for (let i = 0; i < params.length; i++) {
    const element = params[i];
    const date = dateCreated(element.createdOn);

    const incident = `<div class='report-body-wrapper'><div class='report-details'><h4>ID: </h4><p>${element.id}</p></div><div class='report-details'><h4>Type: </h4><p>${(element.type === 'red-flag') ? element.type + '<span class="fa fa-flag"></span>' : element.type + "<span class='fa fa-stop-circle-o'></span>"}</p></div><div class='report-details'><h4>Date: </h4><p>${moment(date).format('MMMM Do YYYY, h:mm:ss a')}</p></div><div class='report-details'><h4>Status: </h4><p>${element.status}</p></div><div class='report-details'><h4>Location: </h4><p>${element.location}</p></div><div class='btn-div'><button class='edit-btn' onclick='navigateToEditPage("${i}")'>Edit Incident</button></div></div>`;

    incidentsViewDiv.innerHTML += incident;
  }
}

incidentViewToggler.addEventListener('change', toggleView)

window.onload = () => {
  fetch(`${apiVersion}incidents`)
    .then(handleResponse)
    .then(res => {
      console.log(res)
      listOfAllIncidents = res.data.incidents;
      filteredList = listOfAllIncidents.reverse();
      updateView(filteredList);
    })
    .catch(err => {
      console.log(err);
    })
}
