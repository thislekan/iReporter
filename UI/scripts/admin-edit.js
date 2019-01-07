const incidentType = document.getElementById('incident-type');
const incidentTitle = document.getElementById('incident-title');
const incidentComment = document.getElementById('incident-comment');
const incidentLocation = document.getElementById('incident-location');
const incidentId = document.getElementById('incident-id');
const incidentStatus = document.getElementById('incident-status');
const incidentDate = document.getElementById('incident-date');

const editIncidentBtn = document.getElementById('edit-btn');

function updateIncidentStatus() {
  const status = incidentStatus.value.trim();
  const id = sessionStorage.getItem('incident');
  const options = {
    method: 'PATCH',
    body: JSON.stringify({ status, id }),
    headers: {
      'Content-Type': 'application/json',
      'x-auth': sessionStorage.getItem('token')
    }
  }

  fetch(`${apiVersion}update/status`, options)
    .then(handleResponse)
    .then(res => {
      console.log(res);
      incidentStatus.disabled = true;
      editIncidentBtn.innerText = 'Edit Status';
    })
    .catch(err => console.log(err))
}

editIncidentBtn.addEventListener('click', (e) => {
  if (e.target.innerText === 'Post Status') {
    updateIncidentStatus();
  } else {
    incidentStatus.disabled = false;
    e.target.innerText = 'Post Status'
  }
})

window.onload = () => {
  const id = sessionStorage.getItem('incident');
  console.log(sessionStorage.getItem('token'));
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': sessionStorage.getItem('token')
    }
  }

  fetch(`${apiVersion}incident/${id}`, options)
    .then(handleResponse)
    .then(res => {
      console.log(res);
    })
    .catch(err => console.log(err));
}